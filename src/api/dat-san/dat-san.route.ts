/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Router } from "express";
import { authenticateToken, checkAdmin } from "@/middlewares/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler.util";
import { DatSanController } from "./dat-san.controller";

const datSanRouter = Router();

datSanRouter.post("/", authenticateToken, asyncHandler(DatSanController.datSan));

datSanRouter.post(
    "/dat-san-theo-thang",
    authenticateToken,
    asyncHandler(DatSanController.datSanTheoThangController)
);

datSanRouter.post(
    "/huy-dat-san",
    authenticateToken,
    asyncHandler(DatSanController.huyDatSan)
);

datSanRouter.get(
    "/booked-slots",
    asyncHandler(DatSanController.getBookedSlots)
);

datSanRouter.get(
    "/lich-su",
    authenticateToken,
    asyncHandler(DatSanController.getLichSuDatSanNguoiThue)
);

datSanRouter.get(
    "/chu-san/slots",
    authenticateToken,
    asyncHandler(DatSanController.getSlotsByChuSan)
);

datSanRouter.get(
    "/chu-san/dashboard-report",
    authenticateToken,
    asyncHandler(DatSanController.getDashboardReportByChuSan)
);

// ADMIN: Lấy tất cả slot của tất cả sân bóng
datSanRouter.get(
    "/admin/slots",
    authenticateToken,
    checkAdmin,
    asyncHandler(DatSanController.getAllSlotsForAdmin)
);

// ADMIN: Chuyển cờ coVanDe
datSanRouter.patch(
    "/admin/slot/:maChiTietDatSan/co-van-de",
    authenticateToken,
    checkAdmin,
    asyncHandler(DatSanController.setCoVanDeForSlot)
);

export default datSanRouter;
