/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { Response } from "express";
import { datSanService } from "./dat-san.service";
import { handleServiceResponse } from "@/services/httpHandlerResponse";
import { DatSanInputDTO } from "./dto/dat-san.dto";
import { DatSanTheoThangInputDTO } from "./dto/dat-san-theo-thang.dto";

export const DatSanController = {
    async datSan(req: AuthenticatedRequest, res: Response) {
        const nguoiThueId = req.user?.maNguoiDung;
        if (!nguoiThueId) {
            return res
                .status(401)
                .json({ message: "Không xác định được người dùng." });
        }
        const { maSanChiTiet, maLoaiDat, soTien, lichDat } = req.body;

        const input: DatSanInputDTO = {
            nguoiThueId,
            maSanChiTiet,
            maLoaiDat,
            soTien,
            lichDat,
        };

        const response = await datSanService.datSan(input);

        return handleServiceResponse(response, res);
    },

    async datSanTheoThangController(req: AuthenticatedRequest, res: Response) {
        const nguoiThueId = req.user?.maNguoiDung;
        if (!nguoiThueId) {
            return res
                .status(401)
                .json({ message: "Không xác định được người dùng." });
        }
        const {
            maSanChiTiet,
            maLoaiDat,
            ngayBatDau,
            ngayKetThuc,
            gioBatDau,
            gioKetThuc,
            thuTrongTuan,
            ghiChu,
        } = req.body;
        const input: DatSanTheoThangInputDTO = {
            nguoiThueId,
            maSanChiTiet,
            maLoaiDat,
            ngayBatDau,
            ngayKetThuc,
            gioBatDau,
            gioKetThuc,
            thuTrongTuan,
            ghiChu,
        };
        // Map DTO to service input (service expects ngayTrongTuan)
        const serviceInput = {
            ...input,
            ngayTrongTuan: thuTrongTuan,
        };
        const response = await datSanService.datSanTheoThang(serviceInput);
        return handleServiceResponse(response, res);
    },

    async getBookedSlots(req: AuthenticatedRequest, res: Response) {
        const maSanChiTiet = req.query.maSanChiTiet as string;
        if (!maSanChiTiet) {
            return res.status(400).json({ message: "Thiếu mã sân chi tiết." });
        }
        // Nhận fromDate, toDate dạng ISO string (tùy chọn)
        const fromDate = req.query.fromDate
            ? new Date(req.query.fromDate as string)
            : undefined;
        const toDate = req.query.toDate
            ? new Date(req.query.toDate as string)
            : undefined;

        const response = await datSanService.getBookedSlots(
            maSanChiTiet,
            fromDate,
            toDate
        );
        return handleServiceResponse(response, res);
    },

    async getLichSuDatSanNguoiThue(req: AuthenticatedRequest, res: Response) {
        const nguoiThueId = req.user?.maNguoiDung;
        if (!nguoiThueId) {
            return res
                .status(401)
                .json({ message: "Không xác định được người dùng." });
        }
        const page = req.query.page
            ? parseInt(req.query.page as string, 10)
            : 1;
        const limit = req.query.limit
            ? parseInt(req.query.limit as string, 10)
            : 10;
        const response = await datSanService.getLichSuDatSanNguoiThue(
            nguoiThueId,
            page,
            limit
        );
        return handleServiceResponse(response, res);
    },

    async huyDatSan(req: AuthenticatedRequest, res: Response) {
        const nguoiThueId = req.user?.maNguoiDung;
        const { maDatSan } = req.body;
        if (!maDatSan) {
            return res.status(400).json({ message: "Thiếu mã đặt sân." });
        }
        if (!nguoiThueId) {
            return res
                .status(401)
                .json({ message: "Không xác định được người dùng." });
        }
        const response = await datSanService.huyDatSan(maDatSan, nguoiThueId);
        return handleServiceResponse(response, res);
    },

    async getSlotsByChuSan(req: AuthenticatedRequest, res: Response) {
        const chuSanId = req.user?.maNguoiDung;
        if (!chuSanId) {
            return res
                .status(401)
                .json({ message: "Không xác định được chủ sân." });
        }
        const trangThaiDatSan = req.query.trangThaiDatSan as string | undefined;
        const ngayDat = req.query.ngayDat as string | undefined;
        const page = req.query.page
            ? parseInt(req.query.page as string, 10)
            : 1;
        const limit = req.query.limit
            ? parseInt(req.query.limit as string, 10)
            : 10;
        const search = req.query.search as string | undefined;

        const response = await datSanService.getSlotsByChuSan(
            chuSanId,
            trangThaiDatSan,
            ngayDat,
            page,
            limit,
            search
        );
        return handleServiceResponse(response, res);
    },

    async getDashboardReportByChuSan(req: AuthenticatedRequest, res: Response) {
        const chuSanId = req.user?.maNguoiDung;
        const year = req.query.year
            ? parseInt(req.query.year as string, 10)
            : new Date().getFullYear();
        const range = (req.query.range as string) || "year"; // "month" | "quarter" | "year"
        if (!chuSanId) {
            return res
                .status(401)
                .json({ message: "Không xác định được chủ sân." });
        }
        const response = await datSanService.getDashboardReportByChuSan(
            chuSanId,
            year,
            range
        );
        return handleServiceResponse(response, res);
    },

    // ADMIN: Lấy tất cả slot của tất cả sân bóng
    async getAllSlotsForAdmin(req: AuthenticatedRequest, res: Response) {
        const page = req.query.page
            ? parseInt(req.query.page as string, 10)
            : 1;
        const limit = req.query.limit
            ? parseInt(req.query.limit as string, 10)
            : 10;
        const trangThaiDatSan = req.query.trangThaiDatSan as string | undefined;
        const search = req.query.search as string | undefined;
        const ngayDat = req.query.ngayDat as string | undefined;
        const response = await datSanService.getAllSlotsForAdmin(
            page,
            limit,
            trangThaiDatSan,
            search,
            ngayDat
        );
        return handleServiceResponse(response, res);
    },

    // ADMIN: Chuyển cờ coVanDe
    async setCoVanDeForSlot(req: AuthenticatedRequest, res: Response) {
        const maChiTietDatSan = req.params.maChiTietDatSan;
        const { coVanDe } = req.body;
        if (typeof coVanDe !== "boolean") {
            return res
                .status(400)
                .json({ message: "coVanDe phải là boolean." });
        }
        const response = await datSanService.setCoVanDeForSlot(
            maChiTietDatSan,
            coVanDe
        );
        return handleServiceResponse(response, res);
    },
};
