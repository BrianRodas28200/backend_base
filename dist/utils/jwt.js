'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
class JwtService {
  static generateAccessToken(payload) {
    return jsonwebtoken_1.default.sign(
      { ...payload, type: 'access' },
      this.ACCESS_TOKEN_SECRET,
      {
        expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
      }
    );
  }
  static generateRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(
      { ...payload, type: 'refresh' },
      this.REFRESH_TOKEN_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN }
    );
  }
  static generateTokenPair(payload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
  static verifyAccessToken(token) {
    try {
      const decoded = jsonwebtoken_1.default.verify(
        token,
        this.ACCESS_TOKEN_SECRET
      );
      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }
      return { userId: decoded.userId, user: decoded.user };
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }
  static verifyRefreshToken(token) {
    try {
      const decoded = jsonwebtoken_1.default.verify(
        token,
        this.REFRESH_TOKEN_SECRET
      );
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
      return { userId: decoded.userId, user: decoded.user };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
exports.JwtService = JwtService;
JwtService.ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_SECRET || 'access-secret';
JwtService.REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET || 'refresh-secret';
JwtService.ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
JwtService.REFRESH_TOKEN_EXPIRES_IN =
  process.env.JWT_REFRESH_EXPIRES_IN || '7d';
