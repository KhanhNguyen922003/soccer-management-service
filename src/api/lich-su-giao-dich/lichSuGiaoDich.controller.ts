/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Request, Response } from "express";
import { LichSuGiaoDichService } from "./lichSuGiaoDich.service";
import { handleServiceResponse } from "@/services/httpHandlerResponse";

const lichSuGiaoDichService = new LichSuGiaoDichService();

export const LichSuGiaoDichController = {
    async getLichSuNapTien(req: Request, res: Response) {
        const { maNguoiDung } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const response = await lichSuGiaoDichService.getLichSuNapTien(
            maNguoiDung,
            page,
            limit
        );
        return handleServiceResponse(response, res);
    },
};
