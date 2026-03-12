'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.loginHandler = exports.authController = exports.AuthController = void 0;
const zod_1 = require('zod');
const BaseController_1 = require('../../controllers/BaseController');
const authService_1 = require('../../services/authService');
const validation_1 = require('../../middleware/validation');
// Validation schemas
const loginSchema = zod_1.z.object({
  user: zod_1.z.string().min(1, 'user is required'),
  password: zod_1.z.string().min(1, 'Password is required'),
});
class AuthController extends BaseController_1.BaseController {
  constructor() {
    super(...arguments);
    this.login = this.handleAsync(async (req, res) => {
      const { user, password } = req.body;
      const result = await authService_1.AuthService.login(user, password);
      if (!result) {
        throw new Error('Invalid credentials');
      }
      this.sendSuccess(res, 'Login successful', result);
    });
  }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
// Route handlers with validation
exports.loginHandler = [
  (0, validation_1.validate)(loginSchema),
  exports.authController.login,
];
