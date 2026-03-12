import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string | number;
  user: string;
  type: 'access' | 'refresh';
}

export class JwtService {
  static ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';
  static REFRESH_TOKEN_SECRET =
    process.env.JWT_REFRESH_SECRET || 'refresh-secret';
  static ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
  static REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  static generateAccessToken(payload: Omit<JwtPayload, 'type'>): string {
    // @ts-ignore - TypeScript issue with jsonwebtoken types
    return jwt.sign({ ...payload, type: 'access' }, this.ACCESS_TOKEN_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  static generateRefreshToken(payload: Omit<JwtPayload, 'type'>): string {
    // @ts-ignore - TypeScript issue with jsonwebtoken types
    return jwt.sign(
      { ...payload, type: 'refresh' },
      this.REFRESH_TOKEN_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRES_IN }
    );
  }

  static generateTokenPair(payload: Omit<JwtPayload, 'type'>): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  static verifyAccessToken(token: string): Omit<JwtPayload, 'type'> {
    try {
      const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET) as JwtPayload;
      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }
      return { userId: decoded.userId, user: decoded.user };
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  static verifyRefreshToken(token: string): Omit<JwtPayload, 'type'> {
    try {
      const decoded = jwt.verify(
        token,
        this.REFRESH_TOKEN_SECRET
      ) as JwtPayload;
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
      return { userId: decoded.userId, user: decoded.user };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
