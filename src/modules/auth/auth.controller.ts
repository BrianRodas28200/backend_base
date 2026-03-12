import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../../controllers/BaseController';
import { AuthService } from '../../services/authService';
import { validate } from '../../middleware/validation';

// Validation schemas
const loginSchema = z.object({
  user: z.string().min(1, 'User is required'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController extends BaseController {
  login = this.handleAsync(async (req: Request, res: Response) => {
    const { user, password } = req.body;
    const result = await AuthService.login(user, password);

    if (!result) {
      throw new Error('Invalid credentials');
    }

    this.sendSuccess(res, 'Login successful', result);
  });
}

export const authController = new AuthController();

// Route handlers with validation
export const loginHandler = [validate(loginSchema), authController.login];
