/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { SanBongService } from "./san-bong.service";
import { Response } from "express";
import { UpdateSanBongDTO } from "./dto/update-san-bong.dto";
import { handleServiceResponse } from "@/services/httpHandlerResponse";
import { CreateSanBongDTO } from "./dto/create-san-bong.dto";

const sanBongService = new SanBongService();

export const SanBongController = {
    async getMySanBong(req: AuthenticatedRequest, res: Response) {
        const chuSanId = req.user?.maNguoiDung;

        if (!chuSanId) {
            return res.status(401).json({ message: 'Không xác định được người dùng.' });
        }

        const response = await sanBongService.getSanBongByChuSan(chuSanId);
        return handleServiceResponse(response, res);
    },
    
    async createSanBong(req: AuthenticatedRequest, res: Response) {
        const chuSanId = req.user?.maNguoiDung;
        // support new middleware: req.uploadedFiles (cloudinary) or legacy req.files (s3)
        const files = (req as any).uploadedFiles || (req as any).files || [];

        const body = req.body;

        const mediaList = files.map((file: any) => ({
            ten: file.originalname || file.name || null,
            link: file.url || file.location || file.path || null,
            loaiMedia: (file.mimetype || file.type || '').startsWith('image/') ? 'image' : 'video',
            mediaId: file.public_id || file.key || null,
        }));

        if (!chuSanId) {
            return res.status(401).json({ message: 'Không xác định được người dùng.' });
        }

        const data: CreateSanBongDTO = {
            ...body,
            media: mediaList
        };

        const response = await sanBongService.createSanBong(chuSanId, data);
        return handleServiceResponse(response, res);
    },

    async updateSanBong(req: AuthenticatedRequest, res: Response) {
        const chuSanId = req.user?.maNguoiDung;
        // const files = req.files as Express.MulterS3.File[];
        const files = (req as any).uploadedFiles || (req as any).files || [];
        const body = req.body;

        if (!chuSanId) {
            return res.status(401).json({ message: 'Không xác định được người dùng.' });
        }

        const mediaList = files.map((file : any) => ({
            ten: file.originalname || file.name || null,
            link: file.url || file.location || file.path || null,
            loaiMedia: (file.mimetype || file.type || '').startsWith('image/') ? 'image' : 'video',
            mediaId: file.public_id || file.key || null,
        }));

        const data: UpdateSanBongDTO = {
            ...body,
            ...(files.length > 0 && { media: mediaList }),
        };

        const response = await sanBongService.updateSanBong(chuSanId, data);
        return handleServiceResponse(response, res);
    },

    async getAllSanBong(req: AuthenticatedRequest, res: Response) {
        const filter = req.query;

        const page = parseInt(filter.page as string) || 1;
        const limit = parseInt(filter.limit as string) || 10;
        const search = filter.search as string | undefined;
        const tenSan = filter.tenSan as string | undefined;
        const diaChi = filter.diaChi as string | undefined;
        const phuongXa = filter.phuongXa as string | undefined;
        const quanHuyen = filter.quanHuyen as string | undefined;
        const viDo = filter.viDo ? parseFloat(filter.viDo as string) : undefined;
        const kinhDo = filter.kinhDo ? parseFloat(filter.kinhDo as string) : undefined;

        const user = (req as any).user || {
            maNguoiDung: null,
            vaiTro: "guest",
        };
        
        const response = await sanBongService.getAllSanBong(
            { search, tenSan, diaChi, phuongXa, quanHuyen, viDo, kinhDo, page, limit },
            user
        );
        
        return handleServiceResponse(response, res);
    },

    async getOneSanBong(req: AuthenticatedRequest, res: Response) {
        const { maSanBong } = req.params;
        const user = req.user
            ? { maNguoiDung: req.user.maNguoiDung as string, vaiTro: req.user.vaiTro as string }
            : { maNguoiDung: "", vaiTro: "guest" };

        const response = await sanBongService.getOneSanBong(maSanBong, user);

        return handleServiceResponse(response, res);
    }
}