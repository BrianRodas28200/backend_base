"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserHandler = exports.getUserByIdHandler = exports.updateUserHandler = exports.createUserHandler = exports.userController = exports.UserController = void 0;
const zod_1 = require("zod");
const BaseController_1 = require("../../controllers/BaseController");
const user_service_1 = require("./user.service");
const validation_1 = require("../../middleware/validation");
// Validation schemas
const createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters')
});
const updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: zod_1.z.string().email('Invalid email format').optional(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters').optional()
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided'
});
const idParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/, 'Invalid ID format')
});
class UserController extends BaseController_1.BaseController {
    constructor() {
        super();
        this.getAllUsers = this.handleAsync(async (req, res) => {
            const { page, limit } = this.getPaginationParams(req);
            const result = await this.userService.getAllUsers(page, limit);
            this.sendSuccess(res, 'Users retrieved successfully', result);
        });
        this.getUserById = this.handleAsync(async (req, res) => {
            const id = this.getIdParam(req);
            const user = await this.userService.getUserById(id);
            this.sendSuccess(res, 'User retrieved successfully', user);
        });
        this.createUser = this.handleAsync(async (req, res) => {
            const userId = await this.userService.createUser(req.body);
            this.sendSuccess(res, 'User created successfully', { id: userId }, 201);
        });
        this.updateUser = this.handleAsync(async (req, res) => {
            const id = this.getIdParam(req);
            const updatedRows = await this.userService.updateUser(id, req.body);
            this.sendSuccess(res, 'User updated successfully', { updatedRows });
        });
        this.deleteUser = this.handleAsync(async (req, res) => {
            const id = this.getIdParam(req);
            const deletedRows = await this.userService.deleteUser(id);
            this.sendSuccess(res, 'User deleted successfully', { deletedRows });
        });
        this.userService = new user_service_1.UserService();
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
// Route handlers with validation
exports.createUserHandler = [(0, validation_1.validate)(createUserSchema), exports.userController.createUser];
exports.updateUserHandler = [(0, validation_1.validateParams)(idParamSchema), (0, validation_1.validate)(updateUserSchema), exports.userController.updateUser];
exports.getUserByIdHandler = [(0, validation_1.validateParams)(idParamSchema), exports.userController.getUserById];
exports.deleteUserHandler = [(0, validation_1.validateParams)(idParamSchema), exports.userController.deleteUser];
