'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthService = void 0;
const auth_model_1 = require('./auth.model');
const password_1 = require('../../utils/password');
const jwt_1 = require('../../utils/jwt');
const errorHandler_1 = require('../../middleware/errorHandler');
class AuthService {
  constructor() {
    this.authModel = new auth_model_1.AuthModel();
  }
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await this.authModel.findByUsuario(userData.user);
      if (existingUser) {
        throw new errorHandler_1.AppError(
          'User with this user already exists',
          409
        );
      }
      // Hash password
      const hashedPassword = await password_1.PasswordService.hash(
        userData.password
      );
      // Create user
      const userId = await this.authModel.createUser({
        name: userData.name,
        user: userData.user,
        password: hashedPassword,
      });
      // Get created user
      const user = await this.authModel.getUserById(userId);
      if (!user) {
        throw new errorHandler_1.AppError('Failed to create user', 500);
      }
      // Generate tokens
      const tokens = jwt_1.JwtService.generateTokenPair({
        userId: user.id,
        user: user.user,
      });
      // Save refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
      await this.authModel.saveRefreshToken(
        user.id,
        tokens.refreshToken,
        expiresAt
      );
      return {
        user: {
          id: user.id,
          name: user.name,
          user: user.user,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof errorHandler_1.AppError) throw error;
      throw new errorHandler_1.AppError('Registration failed', 500);
    }
  }
  async login(loginData) {
    try {
      console.log('🔍 Login attempt for user:', loginData.user);
      // Find user by user
      const user = await this.authModel.findByuser(loginData.user);
      console.log('👤 User found:', user ? 'YES' : 'NO');
      if (!user) {
        console.log('❌ User not found');
        throw new errorHandler_1.AppError('Invalid credentials', 401);
      }
      console.log('🔐 Verifying password...');
      // Verify password
      const isPasswordValid = await password_1.PasswordService.compare(
        loginData.password,
        user.password
      );
      console.log('🔑 Password valid:', isPasswordValid);
      if (!isPasswordValid) {
        console.log('❌ Invalid password');
        throw new errorHandler_1.AppError('Invalid credentials', 401);
      }
      // Generate tokens
      const tokens = jwt_1.JwtService.generateTokenPair({
        userId: user.id,
        user: user.user,
      });
      // Save refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
      await this.authModel.saveRefreshToken(
        user.id,
        tokens.refreshToken,
        expiresAt
      );
      return {
        user: {
          id: user.id,
          name: user.name,
          user: user.user,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof errorHandler_1.AppError) throw error;
      throw new errorHandler_1.AppError('Login failed', 500);
    }
  }
  async refreshToken(refreshTokenData) {
    try {
      // Verify refresh token
      const payload = jwt_1.JwtService.verifyRefreshToken(
        refreshTokenData.refreshToken
      );
      // Check if refresh token exists in database
      const storedToken = await this.authModel.findRefreshToken(
        refreshTokenData.refreshToken
      );
      if (!storedToken) {
        throw new errorHandler_1.AppError('Invalid refresh token', 401);
      }
      // Get user
      const user = await this.authModel.getUserById(payload.userId);
      if (!user) {
        throw new errorHandler_1.AppError('User not found', 404);
      }
      // Generate new tokens
      const tokens = jwt_1.JwtService.generateTokenPair({
        userId: user.id,
        user: user.user,
      });
      // Delete old refresh token
      await this.authModel.deleteRefreshToken(refreshTokenData.refreshToken);
      // Save new refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
      await this.authModel.saveRefreshToken(
        user.id,
        tokens.refreshToken,
        expiresAt
      );
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof errorHandler_1.AppError) throw error;
      throw new errorHandler_1.AppError('Token refresh failed', 401);
    }
  }
  async logout(refreshToken) {
    try {
      await this.authModel.deleteRefreshToken(refreshToken);
    } catch (error) {
      // Don't throw error for logout, just log it
      console.error('Logout error:', error);
    }
  }
  async logoutAll(userId) {
    try {
      await this.authModel.deleteAllUserRefreshTokens(userId);
    } catch (error) {
      // Don't throw error for logout, just log it
      console.error('Logout all error:', error);
    }
  }
  async getProfile(userId) {
    try {
      const user = await this.authModel.getUserById(userId);
      if (!user) {
        throw new errorHandler_1.AppError('User not found', 404);
      }
      return {
        id: user.id,
        name: user.name,
        user: user.user,
      };
    } catch (error) {
      if (error instanceof errorHandler_1.AppError) throw error;
      throw new errorHandler_1.AppError('Failed to get profile', 500);
    }
  }
}
exports.AuthService = AuthService;
