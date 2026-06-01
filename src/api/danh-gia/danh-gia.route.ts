/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Router } from "express";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler.util";
import { DanhGiaController } from "./danh-gia.controller";

const danhGiaRouter = Router();

danhGiaRouter.post(
    "/",
    authenticateToken,
    asyncHandler(DanhGiaController.danhGiaSanBong)
);

danhGiaRouter.get(
    "/:sanBongId",
    asyncHandler(DanhGiaController.getDanhGiaSanBong)
);

export default danhGiaRouter;
