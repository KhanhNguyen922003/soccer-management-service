/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { LoaiSanService } from "./loaiSan.service";
import { Response } from "express";
import { handleServiceResponse } from "@/services/httpHandlerResponse";

const loaiSanService = new LoaiSanService();

export const LoaiSanController = {
    async createLoaiSan(req: AuthenticatedRequest, res: Response) {
        const { tenLoaiSan } = req.body;
        const user = req.user!;
        const response = await loaiSanService.createLoaiSan(tenLoaiSan, user);
        return handleServiceResponse(response, res);
    },
    
    async getAllLoaiSan(req: AuthenticatedRequest, res: Response) {
        const response = await loaiSanService.getAllLoaiSan();
        return handleServiceResponse(response, res);
    },

    async deleteLoaiSan(req: AuthenticatedRequest, res: Response) {
        const { maLoaiSan } = req.params;
        const user = req.user!;
        const response = await loaiSanService.deleteLoaiSan(maLoaiSan, user);
        return handleServiceResponse(response, res);
    },

    async updateLoaiSan(req: AuthenticatedRequest, res: Response) {
        const { maLoaiSan } = req.params;
        const { tenLoaiSan } = req.body;
        const user = req.user!;
        const response = await loaiSanService.updateLoaiSan(maLoaiSan, tenLoaiSan, user);
        return handleServiceResponse(response, res);
    }
}