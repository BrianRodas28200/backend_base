'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthModel = void 0;
const BaseModel_1 = require('../../models/BaseModel');
const database_1 = require('../../utils/database');
class AuthModel extends BaseModel_1.BaseModel {
  constructor() {
    super('users');
  }
  async findByuser(user) {
    console.log('🔍 Searching for user:', user);
    const result = await this.findOneByCondition('user = ?', [user]);
    console.log(
      '👤 Query result:',
      result ? `User found: ${result.user}` : 'User not found'
    );
    return result;
  }
  async createUser(userData) {
    return await this.create(userData);
  }
  async getUserById(id) {
    return await this.findById(id);
  }
  // Refresh token operations
  async saveRefreshToken(userId, token, expiresAt) {
    const sql =
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)';
    return await database_1.DatabaseService.insert(sql, [
      userId,
      token,
      expiresAt,
    ]);
  }
  async findRefreshToken(token) {
    const sql =
      'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()';
    return await database_1.DatabaseService.queryOne(sql, [token]);
  }
  async deleteRefreshToken(token) {
    const sql = 'DELETE FROM refresh_tokens WHERE token = ?';
    return await database_1.DatabaseService.delete(sql, [token]);
  }
  async deleteAllUserRefreshTokens(userId) {
    const sql = 'DELETE FROM refresh_tokens WHERE user_id = ?';
    return await database_1.DatabaseService.delete(sql, [userId]);
  }
}
exports.AuthModel = AuthModel;
