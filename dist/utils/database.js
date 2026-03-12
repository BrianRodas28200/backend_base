"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const database_1 = require("../config/database");
class DatabaseService {
    static async query(sql, params) {
        try {
            const [rows] = await database_1.db.execute(sql, params);
            return rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }
    static async queryOne(sql, params) {
        const rows = await this.query(sql, params);
        return rows.length > 0 ? rows[0] : null;
    }
    static async insert(sql, params) {
        try {
            const [result] = await database_1.db.execute(sql, params);
            return result.insertId;
        }
        catch (error) {
            console.error('Database insert error:', error);
            throw error;
        }
    }
    static async update(sql, params) {
        try {
            const [result] = await database_1.db.execute(sql, params);
            return result.affectedRows;
        }
        catch (error) {
            console.error('Database update error:', error);
            throw error;
        }
    }
    static async delete(sql, params) {
        try {
            const [result] = await database_1.db.execute(sql, params);
            return result.affectedRows;
        }
        catch (error) {
            console.error('Database delete error:', error);
            throw error;
        }
    }
    static async callSP(procedureName, params) {
        try {
            const placeholders = params ? params.map(() => '?').join(', ') : '';
            const sql = `CALL ${procedureName}(${placeholders})`;
            const [rows] = await database_1.db.execute(sql, params);
            return rows;
        }
        catch (error) {
            console.error('Stored procedure error:', error);
            throw error;
        }
    }
    static async callSPOne(procedureName, params) {
        const rows = await this.callSP(procedureName, params);
        return rows.length > 0 ? rows[0] : null;
    }
    static async transaction(callback) {
        const connection = await database_1.db.getConnection();
        try {
            await connection.beginTransaction();
            const result = await callback(connection);
            await connection.commit();
            return result;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
}
exports.DatabaseService = DatabaseService;
