"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const errorHandler_1 = require("./middleware/errorHandler");
const routes_1 = __importDefault(require("./routes"));
const database_1 = require("./config/database");
exports.app = (0, express_1.default)();
// Security middleware
exports.app.use((0, helmet_1.default)());
// CORS middleware
exports.app.use((0, cors_1.default)());
// Compression middleware
exports.app.use((0, compression_1.default)());
// Logging middleware
exports.app.use((0, morgan_1.default)('dev'));
// Body parsing middleware
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
// API routes
exports.app.use('/api', routes_1.default);
// Health check endpoint
exports.app.get('/', async (req, res) => {
    const dbStatus = await (0, database_1.testDatabaseConnection)();
    res.json({
        success: true,
        message: 'API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        database: {
            connected: dbStatus,
            status: dbStatus ? 'connected' : 'disconnected',
        },
    });
});
// Database health check endpoint
exports.app.get('/health/db', async (req, res) => {
    const dbStatus = await (0, database_1.testDatabaseConnection)();
    res.json({
        database: {
            connected: dbStatus,
            status: dbStatus ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString(),
        },
    });
});
// Error handling middleware
exports.app.use(errorHandler_1.notFound);
exports.app.use(errorHandler_1.errorHandler);
