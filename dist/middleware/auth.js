"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const errorHandler_1 = require("./errorHandler");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errorHandler_1.AppError('Access token required', 401);
        }
        const token = authHeader.substring(7);
        const payload = jwt_1.JwtService.verifyAccessToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        next(new errorHandler_1.AppError('Invalid or expired access token', 401));
    }
};
exports.authenticate = authenticate;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = jwt_1.JwtService.verifyAccessToken(token);
            req.user = payload;
        }
        next();
    }
    catch (error) {
        // If token is invalid, continue without authentication
        next();
    }
};
exports.optionalAuth = optionalAuth;
