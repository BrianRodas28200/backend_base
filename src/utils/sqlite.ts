import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import path from 'path';

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export class SQLiteService {
  private static async getDatabase(): Promise<
    Database<sqlite3.Database, sqlite3.Statement>
  > {
    if (!db) {
      // Usar path absoluto o path relativo al directorio raíz del proyecto
      const dbPath = path.join(process.cwd(), 'data', 'refresh_tokens.db');

      // Asegurar que el directorio exista
      const fs = require('fs');
      const dataDir = path.dirname(dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      console.log('🗄️ SQLite database path:', dbPath);

      db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
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

  static async saveRefreshToken(
    userId: string | number,
    token: string,
    expiresAt: Date,
    modulo: string = 'auth'
  ): Promise<void> {
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

  static async findRefreshToken(token: string): Promise<any | null> {
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

  static async deleteRefreshToken(token: string): Promise<void> {
    try {
      const database = await this.getDatabase();
      await database.run('DELETE FROM refresh_tokens WHERE token = ?', [token]);
      console.log('🗑️ Refresh token deleted');
    } catch (error) {
      console.error('❌ Error deleting refresh token:', error);
      throw error;
    }
  }

  static async deleteAllUserRefreshTokens(userId: number): Promise<void> {
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

  static async cleanupExpiredTokens(): Promise<void> {
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
