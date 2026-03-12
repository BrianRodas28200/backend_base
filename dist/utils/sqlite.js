'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.SQLiteService = void 0;
const sqlite3_1 = __importDefault(require('sqlite3'));
const sqlite_1 = require('sqlite');
const path_1 = __importDefault(require('path'));
let db = null;
class SQLiteService {
  static async getDatabase() {
    if (!db) {
      // Usar path absoluto o path relativo al directorio raíz del proyecto
      const dbPath = path_1.default.join(
        process.cwd(),
        'data',
        'refresh_tokens.db'
      );
      // Asegurar que el directorio exista
      const fs = require('fs');
      const dataDir = path_1.default.dirname(dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      console.log('🗄️ SQLite database path:', dbPath);
      db = await (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database,
      });
      // Crear tabla si no existe
      await db.exec(`
        CREATE TABLE IF NOT EXISTS refresh_tokens (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          modulo TEXT NOT NULL DEFAULT 'auth',
          token TEXT NOT NULL,
          expires_at DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, modulo)
        );

        CREATE INDEX IF NOT EXISTS idx_refresh_token ON refresh_tokens(token);
        CREATE INDEX IF NOT EXISTS idx_expires_at ON refresh_tokens(expires_at);
      `);
      console.log('✅ SQLite database initialized for refresh tokens');
    }
    return db;
  }
  static async saveRefreshToken(userId, token, expiresAt, modulo = 'auth') {
    try {
      const database = await this.getDatabase();
      // DELETE + INSERT para asegurar unicidad por user-módulo
      await database.run(
        'DELETE FROM refresh_tokens WHERE user_id = ? AND modulo = ?',
        [userId, modulo]
      );
      await database.run(
        'INSERT INTO refresh_tokens (user_id, modulo, token, expires_at) VALUES (?, ?, ?, ?)',
        [userId, modulo, token, expiresAt.toISOString()]
      );
      console.log(
        `✅ Refresh token saved for user ${userId}, module ${modulo}`
      );
    } catch (error) {
      console.error('❌ Error saving refresh token:', error);
      throw error;
    }
  }
  static async findRefreshToken(token) {
    try {
      const database = await this.getDatabase();
      const result = await database.get(
        'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > datetime("now")',
        [token]
      );
      return result || null;
    } catch (error) {
      console.error('❌ Error finding refresh token:', error);
      throw error;
    }
  }
  static async deleteRefreshToken(token) {
    try {
      const database = await this.getDatabase();
      await database.run('DELETE FROM refresh_tokens WHERE token = ?', [token]);
      console.log('🗑️ Refresh token deleted');
    } catch (error) {
      console.error('❌ Error deleting refresh token:', error);
      throw error;
    }
  }
  static async deleteAllUserRefreshTokens(userId) {
    try {
      const database = await this.getDatabase();
      await database.run('DELETE FROM refresh_tokens WHERE user_id = ?', [
        userId,
      ]);
      console.log(`🗑️ All refresh tokens deleted for user ${userId}`);
    } catch (error) {
      console.error('❌ Error deleting all user refresh tokens:', error);
      throw error;
    }
  }
  static async cleanupExpiredTokens() {
    try {
      const database = await this.getDatabase();
      const result = await database.run(
        'DELETE FROM refresh_tokens WHERE expires_at <= datetime("now")'
      );
      if (result.changes && result.changes > 0) {
        console.log(`🧹 Cleaned up ${result.changes} expired refresh tokens`);
      }
    } catch (error) {
      console.error('❌ Error cleaning up expired tokens:', error);
      throw error;
    }
  }
}
exports.SQLiteService = SQLiteService;
