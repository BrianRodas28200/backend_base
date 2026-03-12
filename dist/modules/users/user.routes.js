"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/users
 * @desc    Get all users with pagination
 * @access  Public
 */
router.get('/', user_controller_1.userController.getAllUsers);
/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:id', user_controller_1.getUserByIdHandler);
/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
router.post('/', user_controller_1.createUserHandler);
/**
 * @route   PUT /api/users/:id
 * @desc    Update user by ID
 * @access  Public
 */
router.put('/:id', user_controller_1.updateUserHandler);
/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user by ID
 * @access  Public
 */
router.delete('/:id', user_controller_1.deleteUserHandler);
exports.default = router;
