/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Router } from "express";
import { YeuCauRutTienController } from "./yeu-cau-rut-tien.controller";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler.util";

const yeuCauRutTienRouter = Router();

// Lấy số dư tài khoản và số dư khả dụng của người dùng hiện tại
yeuCauRutTienRouter.get(
    "/so-du",
    authenticateToken,
    asyncHandler(YeuCauRutTienController.getSoDuNguoiDung)
);

// Người dùng gửi yêu cầu rút tiền
yeuCauRutTienRouter.post(
    "/create",
    authenticateToken,
    asyncHandler(YeuCauRutTienController.createRutTien)
);

// Admin lấy danh sách yêu cầu rút tiền
yeuCauRutTienRouter.get(
    "/all",
    authenticateToken,
    asyncHandler(YeuCauRutTienController.getAllYeuCauRutTien)
);

// Admin xác nhận đã chuyển tiền
yeuCauRutTienRouter.post(
    "/complete",
    authenticateToken,
    asyncHandler(YeuCauRutTienController.xacNhanRutTien)
);

// (Tùy chọn) Lấy số dư cho user bất kỳ (admin dùng)
// yeuCauRutTienRouter.get(
//     "/so-du/:maNguoiDung",
//     authenticateToken,
//     asyncHandler(YeuCauRutTienController.laySoDuNguoiDung)
// );

export default yeuCauRutTienRouter;
