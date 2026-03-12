import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      const message =
        error.errors?.map((err: any) => err.message).join(', ') ||
        'Invalid input';
      console.log('Validation error:', error.errors);
      next(new AppError(message, 400));
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error: any) {
      const message =
        error.errors?.map((err: any) => err.message).join(', ') ||
        'Invalid query parameters';
      next(new AppError(message, 400));
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error: any) {
      const message =
        error.errors?.map((err: any) => err.message).join(', ') ||
        'Invalid parameters';
      next(new AppError(message, 400));
    }
  };
};
