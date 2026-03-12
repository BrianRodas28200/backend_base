import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../config/database';

export class DatabaseService {
  static async query<T extends RowDataPacket = RowDataPacket>(
    sql: string,
    params?: any[]
  ): Promise<T[]> {
    try {
      const [rows] = await db.execute<T[]>(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  static async queryOne<T extends RowDataPacket = RowDataPacket>(
    sql: string,
    params?: any[]
  ): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  static async insert(sql: string, params?: any[]): Promise<number> {
    try {
      const [result] = await db.execute<ResultSetHeader>(sql, params);
      return result.insertId;
    } catch (error) {
      console.error('Database insert error:', error);
      throw error;
    }
  }

  static async update(sql: string, params?: any[]): Promise<number> {
    try {
      const [result] = await db.execute<ResultSetHeader>(sql, params);
      return result.affectedRows;
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  }

  static async delete(sql: string, params?: any[]): Promise<number> {
    try {
      const [result] = await db.execute<ResultSetHeader>(sql, params);
      return result.affectedRows;
    } catch (error) {
      console.error('Database delete error:', error);
      throw error;
    }
  }

  static async callSP<T extends RowDataPacket = RowDataPacket>(
    procedureName: string,
    params?: any[]
  ): Promise<T[]> {
    try {
      const placeholders = params ? params.map(() => '?').join(', ') : '';
      const sql = `CALL ${procedureName}(${placeholders})`;
      const [rows] = await db.execute<T[]>(sql, params);
      return rows;
    } catch (error) {
      console.error('Stored procedure error:', error);
      throw error;
    }
  }

  static async callSPOne<T extends RowDataPacket = RowDataPacket>(
    procedureName: string,
    params?: any[]
  ): Promise<T | null> {
    const rows = await this.callSP<T>(procedureName, params);
    return rows.length > 0 ? rows[0] : null;
  }

  static async transaction<T>(
    callback: (connection: any) => Promise<T>
  ): Promise<T> {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
