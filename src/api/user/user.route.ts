/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { asyncHandler } from "@/utils/asyncHandler.util";
import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticateToken } from "@/middlewares/auth.middleware";
import upload from "@/middlewares/upload.middleware";

const userRouter = Router();

// userRouter.get("/", asyncHandler(UserController.getAllUsers));
// userRouter.get("/:maNguoiDung", asyncHandler(UserController.getUserById));
userRouter.put(
    "/:maNguoiDung",
    authenticateToken,
    upload.single("avatar"),
    asyncHandler(UserController.updateInfoUser)
);
// userRouter.delete("/:maNguoiDung", authenticateToken, asyncHandler(UserController.deleteUser));

export default userRouter;