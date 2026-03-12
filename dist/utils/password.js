"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class PasswordService {
    static async hash(password) {
        return await bcryptjs_1.default.hash(password, this.SALT_ROUNDS);
    }
    static async compare(password, hashedPassword) {
        return await bcryptjs_1.default.compare(password, hashedPassword);
    }
}
exports.PasswordService = PasswordService;
PasswordService.SALT_ROUNDS = 12;
