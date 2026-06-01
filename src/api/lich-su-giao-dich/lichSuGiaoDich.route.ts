/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Router } from "express";
import { LichSuGiaoDichController } from "./lichSuGiaoDich.controller";
import { asyncHandler } from "@/utils/asyncHandler.util";

const lichSuGiaoDichRouter = Router();

lichSuGiaoDichRouter.get(
    "/nap-tien/:maNguoiDung",
    asyncHandler(LichSuGiaoDichController.getLichSuNapTien)
);

export default lichSuGiaoDichRouter;
