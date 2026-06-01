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
import { BaoCaoController } from "./bao-cao.controller";

const baoCaoRouter = Router();

baoCaoRouter.post(
    "/",
    authenticateToken,
    asyncHandler(BaoCaoController.baoCaoSanBong)
);
baoCaoRouter.get(
    "/all",
    authenticateToken,
    asyncHandler(BaoCaoController.getAllBaoCao)
);

export default baoCaoRouter;
