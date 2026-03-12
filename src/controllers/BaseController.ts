import { Request, Response, NextFunction } from 'express';
import { ApiResponse, PaginationParams } from '../types';
import { AppError } from '../middleware/errorHandler';

export abstract class BaseController {
  protected sendSuccess<T>(
    res: Response<ApiResponse<T>>,
    message: string,
    data?: T,
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  protected sendError(
    res: Response<ApiResponse>,
    message: string,
    statusCode: number = 500,
    error?: string
  ): void {
    res.status(statusCode).json({
      success: false,
      message,
      error,
    });
  }

  protected handleAsync(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  protected getPaginationParams(req: Request): PaginationParams {
    const pageParam = req.query.page;
    const limitParam = req.query.limit;

    const page =
      parseInt(
        Array.isArray(pageParam)
          ? (pageParam[0] as string)
          : typeof pageParam === 'string'
            ? pageParam
            : String(pageParam || '')
      ) || 1;
    const limit =
      parseInt(
        Array.isArray(limitParam)
          ? (limitParam[0] as string)
          : typeof limitParam === 'string'
            ? limitParam
            : String(limitParam || '')
      ) || 10;

    if (page < 1) throw new AppError('Page must be greater than 0', 400);
    if (limit < 1 || limit > 100)
      throw new AppError('Limit must be between 1 and 100', 400);

    return { page, limit };
  }

  protected getIdParam(req: Request): number {
    const id = parseInt(String(req.params.id));
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid ID parameter', 400);
    }
    return id;
  }
}
