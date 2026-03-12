"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(name, value) {
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}
exports.env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT || 3000),
    DB_HOST: required("DB_HOST", process.env.DB_HOST),
    DB_PORT: Number(process.env.DB_PORT || 3306),
    DB_NAME: required("DB_NAME", process.env.DB_NAME),
    DB_USER: required("DB_USER", process.env.DB_USER),
    DB_PASSWORD: required("DB_PASSWORD", process.env.DB_PASSWORD),
};
