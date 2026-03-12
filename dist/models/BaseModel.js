"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
const database_1 = require("../utils/database");
class BaseModel {
    constructor(tableName) {
        this.tableName = tableName;
    }
    async findById(id) {
        const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        return await database_1.DatabaseService.queryOne(sql, [id]);
    }
    async findAll(params = { page: 1, limit: 10 }) {
        const offset = (params.page - 1) * params.limit;
        // Get total count
        const countSql = `SELECT COUNT(*) as total FROM ${this.tableName}`;
        const countResult = await database_1.DatabaseService.queryOne(countSql);
        const total = countResult?.total || 0;
        // Get data
        const sql = `SELECT * FROM ${this.tableName} LIMIT ? OFFSET ?`;
        const data = await database_1.DatabaseService.query(sql, [params.limit, offset]);
        return {
            success: true,
            message: "Data retrieved successfully",
            data,
            pagination: {
                page: params.page,
                limit: params.limit,
                total,
                totalPages: Math.ceil(total / params.limit),
            },
        };
    }
    async create(data) {
        const fields = Object.keys(data).join(", ");
        const placeholders = Object.keys(data)
            .map(() => "?")
            .join(", ");
        const values = Object.values(data);
        const sql = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`;
        return await database_1.DatabaseService.insert(sql, values);
    }
    async update(id, data) {
        const fields = Object.keys(data)
            .map((key) => `${key} = ?`)
            .join(", ");
        const values = [...Object.values(data), id];
        const sql = `UPDATE ${this.tableName} SET ${fields} WHERE id = ?`;
        return await database_1.DatabaseService.update(sql, values);
    }
    async delete(id) {
        const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
        return await database_1.DatabaseService.delete(sql, [id]);
    }
    async findByCondition(condition, params = []) {
        const sql = `SELECT * FROM ${this.tableName} WHERE ${condition}`;
        return await database_1.DatabaseService.query(sql, params);
    }
    async findOneByCondition(condition, params = []) {
        const sql = `SELECT * FROM ${this.tableName} WHERE ${condition} LIMIT 1`;
        return await database_1.DatabaseService.queryOne(sql, params);
    }
}
exports.BaseModel = BaseModel;
