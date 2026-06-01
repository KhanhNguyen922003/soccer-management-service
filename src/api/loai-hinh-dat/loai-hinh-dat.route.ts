/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Router } from "express";
import { LoaiHinhDatController } from "./loai-hinh-dat.controller";
import { asyncHandler } from "@/utils/asyncHandler.util";
import { authenticateToken } from "@/middlewares/auth.middleware";

const loaiHinhDatRouter = Router();

loaiHinhDatRouter.post(
    "/",
    authenticateToken,
    asyncHandler(LoaiHinhDatController.createLoaiHinhDat)
);

loaiHinhDatRouter.get(
    "/",
    asyncHandler(LoaiHinhDatController.getAllLoaiHinhDat)
);

loaiHinhDatRouter.put(
    "/:maLoaiDat",
    authenticateToken,
    asyncHandler(LoaiHinhDatController.updateLoaiHinhDat)
);

loaiHinhDatRouter.delete(
    "/:maLoaiDat",
    authenticateToken,
    asyncHandler(LoaiHinhDatController.deleteLoaiHinhDat)
);

export default loaiHinhDatRouter;
