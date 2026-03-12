"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const BaseModel_1 = require("../../models/BaseModel");
class UserModel extends BaseModel_1.BaseModel {
    constructor() {
        super('users');
    }
    async findByEmail(email) {
        return await this.findOneByCondition('email = ?', [email]);
    }
    async createUser(userData) {
        return await this.create(userData);
    }
    async updateUser(id, userData) {
        return await this.update(id, userData);
    }
    async deleteUser(id) {
        return await this.delete(id);
    }
    async getUserById(id) {
        return await this.findById(id);
    }
    async getAllUsers(page = 1, limit = 10) {
        return await this.findAll({ page, limit });
    }
}
exports.UserModel = UserModel;
