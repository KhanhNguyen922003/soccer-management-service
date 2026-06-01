/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Request, Response } from "express";
import { yeuCauRutTienService } from "./yeu-cau-rut-tien.service";
import { handleServiceResponse } from "@/services/httpHandlerResponse";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { CreateYeuCauRutTienDTO } from "./dto/create-yeu-cau-rut-tien.dto";

export const YeuCauRutTienController = {
    async getSoDuNguoiDung(req: AuthenticatedRequest, res: Response) {
        let maNguoiDung =
            req.user?.maNguoiDung ||
            req.params.maNguoiDung ||
            req.query.maNguoiDung;
        if (Array.isArray(maNguoiDung)) maNguoiDung = maNguoiDung[0];
        if (typeof maNguoiDung !== "string" || !maNguoiDung) {
            return res
                .status(400)
                .json({ message: "Không xác định được người dùng." });
        }
        const response = await yeuCauRutTienService.getSoDuNguoiDung(
            maNguoiDung
        );
        return handleServiceResponse(response, res);
    },

    async createRutTien(req: AuthenticatedRequest, res: Response) {
        const dto: CreateYeuCauRutTienDTO = req.body;
        const maNguoiDung = req.user?.maNguoiDung;
        if (!maNguoiDung) {
            return res
                .status(401)
                .json({ message: "Không xác định được người dùng." });
        }
        dto.soTien = Number(dto.soTien);
        const response = await yeuCauRutTienService.createRutTien(
            maNguoiDung,
            dto
        );
        return handleServiceResponse(response, res);
    },

    async getAllYeuCauRutTien(req: AuthenticatedRequest, res: Response) {
        const { page = 1, limit = 20, search, trangThai, fromDate, toDate } = req.query;

        if (!req.user || req.user.vaiTro !== "admin") {
            return res.status(403).json({
                message: "Chỉ admin mới có quyền xem danh sách yêu cầu rút tiền",
            });
        }
        const response = await yeuCauRutTienService.getAllYeuCauRutTien(
            Number(page),
            Number(limit),
            undefined,
            search as string | undefined,
            trangThai as string | undefined,
            fromDate as string | undefined,
            toDate as string | undefined
        );
        return handleServiceResponse(response, res);
    },

    async xacNhanRutTien(req: AuthenticatedRequest, res: Response) {
        const { maYeuCau } = req.body;
        const maAdmin = req.user?.maNguoiDung;
        if (!maAdmin) {
            return res
                .status(401)
                .json({ message: "Không xác định được người dùng." });
        }

        if (req.user?.vaiTro !== "admin") {
            return res.status(403).json({ message: "Chỉ admin mới có quyền xác nhận rút tiền." });
        }
        
        const response = await yeuCauRutTienService.xacNhanRutTien(maYeuCau);
        return handleServiceResponse(response, res);
    },
};
