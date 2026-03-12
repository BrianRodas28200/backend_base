import { RowDataPacket } from 'mysql2';
import { BaseModel } from '../../models/BaseModel';
import { DatabaseService } from '../../utils/database';

export interface User extends RowDataPacket {
  id: number;
  name: string;
  user: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface RefreshToken extends RowDataPacket {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  created_at: Date;
}

export class AuthModel extends BaseModel {
  constructor() {
    super('users');
  }

  async findByuser(user: string): Promise<User | null> {
    console.log('🔍 Searching for user:', user);
    const result = await this.findOneByCondition<User>('user = ?', [user]);
    console.log(
      '👤 Query result:',
      result ? `User found: ${result.user}` : 'User not found'
    );
    return result;
  }

  async createUser(userData: {
    name: string;
    user: string;
    password: string;
  }): Promise<number> {
    return await this.create(userData);
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.findById<User>(id);
  }

  // Refresh token operations
  async saveRefreshToken(
    userId: number,
    token: string,
    expiresAt: Date
  ): Promise<number> {
    const sql =
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)';
    return await DatabaseService.insert(sql, [userId, token, expiresAt]);
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    const sql =
      'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()';
    return await DatabaseService.queryOne<RefreshToken>(sql, [token]);
  }

  async deleteRefreshToken(token: string): Promise<number> {
    const sql = 'DELETE FROM refresh_tokens WHERE token = ?';
    return await DatabaseService.delete(sql, [token]);
  }

  async deleteAllUserRefreshTokens(userId: number): Promise<number> {
    const sql = 'DELETE FROM refresh_tokens WHERE user_id = ?';
    return await DatabaseService.delete(sql, [userId]);
  }
}
