import { RowDataPacket } from 'mysql2';
import { BaseModel } from '../../models/BaseModel';

export interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
}

export class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOneByCondition<User>('email = ?', [email]);
  }

  async createUser(userData: CreateUserRequest): Promise<number> {
    return await this.create(userData);
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<number> {
    return await this.update(id, userData);
  }

  async deleteUser(id: number): Promise<number> {
    return await this.delete(id);
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.findById<User>(id);
  }

  async getAllUsers(page: number = 1, limit: number = 10) {
    return await this.findAll<User>({ page, limit });
  }
}
