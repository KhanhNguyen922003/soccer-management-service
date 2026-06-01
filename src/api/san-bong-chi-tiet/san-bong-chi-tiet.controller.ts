/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { SanBongChiTietService } from "./san-bong-chi-tiet.service";
import { Response } from "express";
import { handleServiceResponse } from "@/services/httpHandlerResponse";

const sanBongChiTietService = new SanBongChiTietService();

export const SanBongChiTietController = {
    async createSanBongChiTiet(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const maSanBong = req.params.maSanBong;
        // support new middleware: req.uploadedFiles (cloudinary) or legacy req.file (s3)
        const file = (req as any).uploadedFiles?.[0] || (req as any).file || undefined;

        const response = await sanBongChiTietService.createSanBongChiTiet(
            maSanBong,
            req.body,
            file,
            user
        );

        return handleServiceResponse(response, res);
    },

    async updateSanBongChiTiet(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const maSanChiTiet = req.params.maSanChiTiet;
        const file = (req as any).uploadedFiles?.[0] || (req as any).file || undefined;

        const response = await sanBongChiTietService.updateSanBongChiTiet(
            maSanChiTiet,
            req.body,
            file,
            user
        );

        return handleServiceResponse(response, res);
    },

    async deleteSanBongChiTiet(req: AuthenticatedRequest, res: Response) {
        const user = req.user!;
        const maSanChiTiet = req.params.maSanChiTiet;
        const response = await sanBongChiTietService.deleteSanBongChiTiet(
            maSanChiTiet,
            user
        );
        return handleServiceResponse(response, res);
    },

    async getAllSanBongChiTiet(req: AuthenticatedRequest, res: Response) {
        const maSanBong = req.params.maSanBong;
        const {
            tenSanChiTiet,
            maLoaiSan,
            page = "1",
            limit = "10",
        } = req.query;

        // Chuyển page, limit sang number
        const pageNumber = parseInt(page as string, 10) || 1;
        const limitNumber = parseInt(limit as string, 10) || 10;

        const response = await sanBongChiTietService.getAllSanBongChiTiet(
            maSanBong,
            {
                tenSanChiTiet: tenSanChiTiet as string | undefined,
                maLoaiSan: maLoaiSan as string | undefined,
                page: pageNumber,
                limit: limitNumber,
            }
        );

        return handleServiceResponse(response, res);
    },

    async getOneSanBongChiTiet(req: AuthenticatedRequest, res: Response) {
        const maSanChiTiet = req.params.maSanChiTiet;

        const response = await sanBongChiTietService.getOneSanBongChiTiet(
            maSanChiTiet
        );

        return handleServiceResponse(response, res);
    },
};
