/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { authenticateToken } from "@/middlewares/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler.util";
import { Router } from "express";
import { LoaiSanController } from "./loaiSan.controller";


const loaiSanRouter = Router();

loaiSanRouter.post("/", authenticateToken, asyncHandler(LoaiSanController.createLoaiSan));
loaiSanRouter.get("/", asyncHandler(LoaiSanController.getAllLoaiSan));
loaiSanRouter.delete("/:maLoaiSan", authenticateToken, asyncHandler(LoaiSanController.deleteLoaiSan));
loaiSanRouter.put("/:maLoaiSan", authenticateToken, asyncHandler(LoaiSanController.updateLoaiSan));

export default loaiSanRouter;