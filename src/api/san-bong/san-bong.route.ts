/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { authenticateToken, optionalAuthenticateToken } from "@/middlewares/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler.util";
import { Router } from "express";
import { SanBongController } from "./san-bong.controller";
import { uploadMultipleImages } from "@/middlewares/upload.middleware";

const sanBongRouter = Router();

sanBongRouter.get("/me", authenticateToken, asyncHandler(SanBongController.getMySanBong));
sanBongRouter.post("/", authenticateToken, uploadMultipleImages('media[]'), asyncHandler(SanBongController.createSanBong));
sanBongRouter.put("/", authenticateToken, uploadMultipleImages('media[]'), asyncHandler(SanBongController.updateSanBong));


sanBongRouter.get(
    "/",
    optionalAuthenticateToken,
    asyncHandler(SanBongController.getAllSanBong)
);
sanBongRouter.get(
    "/:maSanBong",
    optionalAuthenticateToken,
    asyncHandler(SanBongController.getOneSanBong)
);

export default sanBongRouter;