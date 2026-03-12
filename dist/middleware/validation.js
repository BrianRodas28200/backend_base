"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validate = void 0;
const errorHandler_1 = require("./errorHandler");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            const message = error.errors?.map((err) => err.message).join(', ') || 'Invalid input';
            next(new errorHandler_1.AppError(message, 400));
        }
    };
};
exports.validate = validate;
const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.query);
            next();
        }
        catch (error) {
            const message = error.errors?.map((err) => err.message).join(', ') || 'Invalid query parameters';
            next(new errorHandler_1.AppError(message, 400));
        }
    };
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.params);
            next();
        }
        catch (error) {
            const message = error.errors?.map((err) => err.message).join(', ') || 'Invalid parameters';
            next(new errorHandler_1.AppError(message, 400));
        }
    };
};
exports.validateParams = validateParams;
