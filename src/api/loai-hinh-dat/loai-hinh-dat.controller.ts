/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Request, Response } from "express";
import { loaiHinhDatService } from "./loai-hinh-dat.service";
import { handleServiceResponse } from "@/services/httpHandlerResponse";
import { CreateLoaiHinhDatDTO } from "./dto/create-loai-hinh-dat.dto";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";

export const LoaiHinhDatController = {
    async createLoaiHinhDat(req: AuthenticatedRequest, res: Response) {
        const { tenLoaiDat, code } = req.body;
        const data: CreateLoaiHinhDatDTO = { tenLoaiDat, code };
        const user = req.user!;
        const response = await loaiHinhDatService.createLoaiHinhDat(data, user);
        return handleServiceResponse(response, res);
    },

    async getAllLoaiHinhDat(req: Request, res: Response) {
        const response = await loaiHinhDatService.getAllLoaiHinhDat();
        return handleServiceResponse(response, res);
    },

    async updateLoaiHinhDat(req: AuthenticatedRequest, res: Response) {
        const { maLoaiDat } = req.params;
        const { tenLoaiDat, code } = req.body;
        const user = req.user!;
        const response = await loaiHinhDatService.updateLoaiHinhDat(maLoaiDat, tenLoaiDat, code, user);
        return handleServiceResponse(response, res);
    },

    async deleteLoaiHinhDat(req: AuthenticatedRequest, res: Response) {
        const { maLoaiDat } = req.params;
        const user = req.user!;
        const response = await loaiHinhDatService.deleteLoaiHinhDat(maLoaiDat, user);
        return handleServiceResponse(response, res);
    },
};
