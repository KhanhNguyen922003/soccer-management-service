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
import { SanBongChiTietController } from "./san-bong-chi-tiet.controller";
import upload, { uploadSingleImage } from "@/middlewares/upload.middleware";

const sanBongChiTietRouter = Router();

sanBongChiTietRouter.post(
    "/:maSanBong",
    authenticateToken,
    uploadSingleImage("hinhAnh"),
    asyncHandler(SanBongChiTietController.createSanBongChiTiet)
);
sanBongChiTietRouter.put(
    "/:maSanChiTiet",
    authenticateToken,
    uploadSingleImage("hinhAnh"),
    asyncHandler(SanBongChiTietController.updateSanBongChiTiet)
);
sanBongChiTietRouter.delete(
    "/:maSanChiTiet",
    authenticateToken,
    asyncHandler(SanBongChiTietController.deleteSanBongChiTiet)
);
sanBongChiTietRouter.get(
    "/all/:maSanBong",
    asyncHandler(SanBongChiTietController.getAllSanBongChiTiet)
);
sanBongChiTietRouter.get(
    "/:maSanChiTiet",
    asyncHandler(SanBongChiTietController.getOneSanBongChiTiet)
);

export default sanBongChiTietRouter;
