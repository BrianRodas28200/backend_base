import { DatabaseService } from "../utils/database";
import { PaginationParams, PaginatedResponse } from "../types";
import { RowDataPacket } from "mysql2";

export abstract class BaseModel {
    protected tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    async findById<T extends RowDataPacket>(id: number | string): Promise<T | null> {
        const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        return await DatabaseService.queryOne<T>(sql, [id]);
    }

    async findAll<T extends RowDataPacket>(params: PaginationParams = { page: 1, limit: 10 }): Promise<PaginatedResponse<T>> {
        const offset = (params.page - 1) * params.limit;

        // Get total count
        const countSql = `SELECT COUNT(*) as total FROM ${this.tableName}`;
        const countResult = await DatabaseService.queryOne<RowDataPacket & { total: number }>(countSql);
        const total = countResult?.total || 0;

        // Get data
        const sql = `SELECT * FROM ${this.tableName} LIMIT ? OFFSET ?`;
        const data = await DatabaseService.query<T>(sql, [params.limit, offset]);

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

    async create<T extends Record<string, any>>(data: Partial<T>): Promise<number> {
        const fields = Object.keys(data).join(", ");
        const placeholders = Object.keys(data)
            .map(() => "?")
            .join(", ");
        const values = Object.values(data);

        const sql = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`;
        return await DatabaseService.insert(sql, values);
    }

    async update<T extends Record<string, any>>(id: number | string, data: Partial<T>): Promise<number> {
        const fields = Object.keys(data)
            .map((key) => `${key} = ?`)
            .join(", ");
        const values = [...Object.values(data), id];

        const sql = `UPDATE ${this.tableName} SET ${fields} WHERE id = ?`;
        return await DatabaseService.update(sql, values);
    }

    async delete(id: number | string): Promise<number> {
        const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
        return await DatabaseService.delete(sql, [id]);
    }

    async findByCondition<T extends RowDataPacket>(condition: string, params: any[] = []): Promise<T[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE ${condition}`;
        return await DatabaseService.query<T>(sql, params);
    }

    async findOneByCondition<T extends RowDataPacket>(condition: string, params: any[] = []): Promise<T | null> {
        const sql = `SELECT * FROM ${this.tableName} WHERE ${condition} LIMIT 1`;
        return await DatabaseService.queryOne<T>(sql, params);
    }
}
