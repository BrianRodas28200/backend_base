export interface LoginRequest {
  user: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  user: string;
  password: string;
}

export interface JwtPayload {
  userId: string | number;
  user: string;
  type: 'access' | 'refresh';
}

export interface AuthResponse {
  user: {
    id: string | number;
    name: string;
    user: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
