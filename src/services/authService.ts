import { DatabaseService } from '../utils/database';
import { RowDataPacket } from 'mysql2';
import { JwtService } from '../utils/jwt';
import { SQLiteService } from '../utils/sqlite';

export interface LoginResult extends RowDataPacket {
  pk_user: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role_name: string;
}

export interface AuthResponse {
  user: {
    id: string | number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role_name: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  static async login(
    user: string,
    password: string
  ): Promise<AuthResponse | null> {
    try {
      console.log('🔍 Login attempt for username:', user);

      // Llamar al procedimiento almacenado
      const spResult = await DatabaseService.callSPOne<LoginResult>(
        'sp_login',
        [user, password]
      );

      console.log('👤 SP Login result:', spResult ? 'SUCCESS' : 'FAILED');

      if (!spResult) {
        const error = new Error('user o contraseña incorrectos');
        (error as any).statusCode = 401;
        throw error;
      }

      // El SP devuelve un array, necesitamos el primer elemento
      const result = Array.isArray(spResult) ? spResult[0] : spResult;

      // Validar que tengamos un resultado válido
      if (!result) {
        const error = new Error('user o contraseña incorrectos');
        (error as any).statusCode = 401;
        throw error;
      }

      // Mostrar la estructura completa del resultado
      console.log(
        '📊 Full SP result object:',
        JSON.stringify(spResult, null, 2)
      );
      console.log('📊 Result keys:', Object.keys(result));
      console.log(
        '📊 pk_user value:',
        result.pk_user,
        'type:',
        typeof result.pk_user
      );
      console.log(
        '📊 username value:',
        result.username,
        'type:',
        typeof result.username
      );

      // Generar tokens usando los datos del user
      console.log(
        '🔑 Generating tokens for user:',
        result.pk_user,
        result.username
      );
      const tokens = JwtService.generateTokenPair({
        userId: result.pk_user,
        user: result.username,
      });

      console.log('🎟️ Tokens generated:', {
        accessToken: tokens.accessToken ? 'OK' : 'UNDEFINED',
        refreshToken: tokens.refreshToken ? 'OK' : 'UNDEFINED',
      });

      // Validar que los tokens se generaron correctamente
      if (!tokens.accessToken || !tokens.refreshToken) {
        throw new Error('Failed to generate tokens');
      }

      // Guardar refresh token en SQLite (DELETE + INSERT para asegurar unicidad)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

      console.log('💾 Saving refresh token to SQLite with params:', [
        result.pk_user,
        tokens.refreshToken,
        expiresAt,
      ]);

      await SQLiteService.saveRefreshToken(
        result.pk_user,
        tokens.refreshToken,
        expiresAt,
        'auth' // módulo por defecto
      );

      return {
        user: {
          id: result.pk_user,
          username: result.username,
          first_name: result.first_name,
          last_name: result.last_name,
          email: result.email,
          role_name: result.role_name,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
}
