import {
  UserModel,
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from './user.model';
import { AppError } from '../../middleware/errorHandler';

export class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async getAllUsers(page: number = 1, limit: number = 10) {
    try {
      return await this.userModel.getAllUsers(page, limit);
    } catch (error) {
      throw new AppError('Failed to fetch users', 500);
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const user = await this.userModel.getUserById(id);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch user', 500);
    }
  }

  async createUser(userData: CreateUserRequest): Promise<number> {
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findByEmail(userData.email);
      if (existingUser) {
        throw new AppError('User with this email already exists', 409);
      }

      // In a real application, you would hash the password here
      // const hashedPassword = await bcrypt.hash(userData.password, 10);

      return await this.userModel.createUser({
        ...userData,
        // password: hashedPassword
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create user', 500);
    }
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<number> {
    try {
      const user = await this.getUserById(id);

      // If email is being updated, check if it's already taken
      if (userData.email && userData.email !== user!.email) {
        const existingUser = await this.userModel.findByEmail(userData.email);
        if (existingUser) {
          throw new AppError('Email already in use', 409);
        }
      }

      // In a real application, you would hash the password if it's being updated
      // if (userData.password) {
      //   userData.password = await bcrypt.hash(userData.password, 10);
      // }

      return await this.userModel.updateUser(id, userData);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update user', 500);
    }
  }

  async deleteUser(id: number): Promise<number> {
    try {
      await this.getUserById(id); // Verify user exists
      return await this.userModel.deleteUser(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete user', 500);
    }
  }
}
