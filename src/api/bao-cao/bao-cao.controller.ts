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
import { baoCaoService } from "./bao-cao.service";
import { handleServiceResponse } from "@/services/httpHandlerResponse";

export const BaoCaoController = {
    async baoCaoSanBong(req: AuthenticatedRequest, res: Response) {
        const nguoiThueId = req.user?.maNguoiDung;
        if (!nguoiThueId) {
            return res
                .status(401)
                .json({ message: "Không xác định được người dùng." });
        }
        const { sanBongId, lyDo } = req.body;
        if (!sanBongId || !lyDo) {
            return res
                .status(400)
                .json({ message: "Thiếu thông tin báo cáo." });
        }
        const response = await baoCaoService.baoCaoSanBong({
            sanBongId,
            nguoiThueId,
            lyDo,
        });
        return handleServiceResponse(response, res);
    },

    async getAllBaoCao(req: AuthenticatedRequest, res: Response) {
        if (!req.user || req.user.vaiTro !== "admin") {
            return res
                .status(403)
                .json({
                    message: "Chỉ admin mới có quyền xem danh sách báo cáo",
                });
        }
        const { page = 1, limit = 20, search, fromDate, toDate } = req.query;
        const response = await baoCaoService.getAllBaoCao({
            page: Number(page),
            limit: Number(limit),
            search: search as string | undefined,
            fromDate: fromDate as string | undefined,
            toDate: toDate as string | undefined,
        });
        return handleServiceResponse(response, res);
    },
};
