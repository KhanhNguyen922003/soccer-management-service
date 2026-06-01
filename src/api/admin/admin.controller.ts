/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */
import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { handleServiceResponse } from "@/services/httpHandlerResponse";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";

const adminService = new AdminService();

export const AdminController = {
    async getAllSanBongForAdmin(req: Request, res: Response) {
        const { search, tenSan, quanHuyen, phuongXa, diaChi, daDuyet, page, limit } = req.query;

        const response = await adminService.getAllSanBongForAdmin({
            search: search as string,
            tenSan: tenSan as string,
            quanHuyen: quanHuyen as string,
            phuongXa: phuongXa as string,
            diaChi: diaChi as string,
            daDuyet: typeof daDuyet === "string" ? daDuyet : undefined,
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 10,
        });

        return handleServiceResponse(response, res);
    },

    async approveSanBong(req: AuthenticatedRequest, res: Response) {
        const maSanBong = req.params.maSanBong;
        const user = req.user!;

        const response = await adminService.approveSanBong(maSanBong, user);

        return handleServiceResponse(response, res);
    },

    async disableSanBong(req: AuthenticatedRequest, res: Response) {
        const maSanBong = req.params.maSanBong;
        const user = req.user!;
        const response = await adminService.disableSanBong(maSanBong, user);
        return handleServiceResponse(response, res);
    },
};
