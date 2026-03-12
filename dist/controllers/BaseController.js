"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
class BaseController {
    sendSuccess(res, message, data, statusCode = 200) {
        res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
    sendError(res, message, statusCode = 500, error) {
        res.status(statusCode).json({
            success: false,
            message,
            error,
        });
    }
    handleAsync(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    }
    getPaginationParams(req) {
        const pageParam = req.query.page;
        const limitParam = req.query.limit;
        const page = parseInt(Array.isArray(pageParam)
            ? pageParam[0]
            : typeof pageParam === 'string'
                ? pageParam
                : String(pageParam || '')) || 1;
        const limit = parseInt(Array.isArray(limitParam)
            ? limitParam[0]
            : typeof limitParam === 'string'
                ? limitParam
                : String(limitParam || '')) || 10;
        if (page < 1)
            throw new errorHandler_1.AppError('Page must be greater than 0', 400);
        if (limit < 1 || limit > 100)
            throw new errorHandler_1.AppError('Limit must be between 1 and 100', 400);
        return { page, limit };
    }
    getIdParam(req) {
        const id = parseInt(String(req.params.id));
        if (isNaN(id) || id <= 0) {
            throw new errorHandler_1.AppError('Invalid ID parameter', 400);
        }
        return id;
    }
}
exports.BaseController = BaseController;
