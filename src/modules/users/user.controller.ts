import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../../controllers/BaseController';
import { UserService } from './user.service';
import { validate, validateParams } from '../../middleware/validation';

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided'
});

const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid ID format')
});

export class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  getAllUsers = this.handleAsync(async (req: Request, res: Response) => {
    const { page, limit } = this.getPaginationParams(req);
    const result = await this.userService.getAllUsers(page, limit);
    this.sendSuccess(res, 'Users retrieved successfully', result);
  });

  getUserById = this.handleAsync(async (req: Request, res: Response) => {
    const id = this.getIdParam(req);
    const user = await this.userService.getUserById(id);
    this.sendSuccess(res, 'User retrieved successfully', user);
  });

  createUser = this.handleAsync(async (req: Request, res: Response) => {
    const userId = await this.userService.createUser(req.body);
    this.sendSuccess(res, 'User created successfully', { id: userId }, 201);
  });

  updateUser = this.handleAsync(async (req: Request, res: Response) => {
    const id = this.getIdParam(req);
    const updatedRows = await this.userService.updateUser(id, req.body);
    this.sendSuccess(res, 'User updated successfully', { updatedRows });
  });

  deleteUser = this.handleAsync(async (req: Request, res: Response) => {
    const id = this.getIdParam(req);
    const deletedRows = await this.userService.deleteUser(id);
    this.sendSuccess(res, 'User deleted successfully', { deletedRows });
  });
}

export const userController = new UserController();

// Route handlers with validation
export const createUserHandler = [validate(createUserSchema), userController.createUser];
export const updateUserHandler = [validateParams(idParamSchema), validate(updateUserSchema), userController.updateUser];
export const getUserByIdHandler = [validateParams(idParamSchema), userController.getUserById];
export const deleteUserHandler = [validateParams(idParamSchema), userController.deleteUser];
