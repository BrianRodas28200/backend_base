"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/auth/login
 * @desc    Login user using stored procedure
 * @access  Public
 */
router.post('/login', auth_controller_1.loginHandler);
exports.default = router;
