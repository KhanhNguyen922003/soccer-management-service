/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Router } from 'express';
import { AuthController } from './auth.controller';
import { asyncHandler } from '@/utils/asyncHandler.util';
import { authenticateToken } from '@/middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/signup', asyncHandler(AuthController.signUp));
authRouter.post("/verify-email", asyncHandler(AuthController.verifyEmail));
authRouter.post("/set-password", asyncHandler(AuthController.setPassword));
authRouter.post('/signin', asyncHandler(AuthController.signIn));
authRouter.post('/refresh-token', asyncHandler(AuthController.refreshToken));
authRouter.post('/google-auth', asyncHandler(AuthController.googleSignIn));
authRouter.get('/profile', authenticateToken, asyncHandler(AuthController.getProfile));
authRouter.post('/logout', asyncHandler(AuthController.logout));

export default authRouter;