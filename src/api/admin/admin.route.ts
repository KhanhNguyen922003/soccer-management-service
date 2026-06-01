/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Router } from "express";
import { AdminController } from "./admin.controller";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler.util";

const adminRouter = Router();

adminRouter.get(
    "/all-san-bong",
    authenticateToken,
    asyncHandler(AdminController.getAllSanBongForAdmin)
);

adminRouter.put(
    "/:maSanBong/approve",
    authenticateToken,
    asyncHandler(AdminController.approveSanBong)
);

adminRouter.put(
    "/:maSanBong/disable",
    authenticateToken,
    asyncHandler(AdminController.disableSanBong)
);

export default adminRouter;