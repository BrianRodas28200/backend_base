"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("./user.model");
const errorHandler_1 = require("../../middleware/errorHandler");
class UserService {
    constructor() {
        this.userModel = new user_model_1.UserModel();
    }
    async getAllUsers(page = 1, limit = 10) {
        try {
            return await this.userModel.getAllUsers(page, limit);
        }
        catch (error) {
            throw new errorHandler_1.AppError('Failed to fetch users', 500);
        }
    }
    async getUserById(id) {
        try {
            const user = await this.userModel.getUserById(id);
            if (!user) {
                throw new errorHandler_1.AppError('User not found', 404);
            }
            return user;
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError('Failed to fetch user', 500);
        }
    }
    async createUser(userData) {
        try {
            // Check if user already exists
            const existingUser = await this.userModel.findByEmail(userData.email);
            if (existingUser) {
                throw new errorHandler_1.AppError('User with this email already exists', 409);
            }
            // In a real application, you would hash the password here
            // const hashedPassword = await bcrypt.hash(userData.password, 10);
            return await this.userModel.createUser({
                ...userData,
                // password: hashedPassword
            });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError('Failed to create user', 500);
        }
    }
    async updateUser(id, userData) {
        try {
            const user = await this.getUserById(id);
            // If email is being updated, check if it's already taken
            if (userData.email && userData.email !== user.email) {
                const existingUser = await this.userModel.findByEmail(userData.email);
                if (existingUser) {
                    throw new errorHandler_1.AppError('Email already in use', 409);
                }
            }
            // In a real application, you would hash the password if it's being updated
            // if (userData.password) {
            //   userData.password = await bcrypt.hash(userData.password, 10);
            // }
            return await this.userModel.updateUser(id, userData);
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError('Failed to update user', 500);
        }
    }
    async deleteUser(id) {
        try {
            await this.getUserById(id); // Verify user exists
            return await this.userModel.deleteUser(id);
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError('Failed to delete user', 500);
        }
    }
}
exports.UserService = UserService;
