/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { danhGiaService } from "./danh-gia.service";
import { handleServiceResponse } from "@/services/httpHandlerResponse";

export const DanhGiaController = {
    async danhGiaSanBong(req: AuthenticatedRequest, res: Response) {
        const nguoiThueId = req.user?.maNguoiDung;
        if (!nguoiThueId) {
            return res.status(401).json({ message: "Không xác định được người dùng." });
        }
        const { sanBongId, diemSo, binhLuan } = req.body;
        if (!sanBongId || typeof diemSo !== "number" || diemSo < 1 || diemSo > 5) {
            return res.status(400).json({ message: "Thiếu hoặc sai thông tin đánh giá." });
        }
        const response = await danhGiaService.danhGiaSanBong({
            sanBongId,
            nguoiThueId,
            diemSo,
            binhLuan,
        });
        return handleServiceResponse(response, res);
    },

    async getDanhGiaSanBong(req: AuthenticatedRequest, res: Response) {
        const sanBongId: string = req.params.sanBongId;
        if (!sanBongId) {
            return res.status(400).json({ message: "Thiếu mã sân bóng." });
        }
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        const response = await danhGiaService.getDanhGiaSanBong(sanBongId, page, limit);
        return handleServiceResponse(response, res);
    },
};
