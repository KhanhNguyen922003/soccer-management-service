/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import AppDataSource from "@/config/typeorm.config";
import { LoaiHinhDat } from "@/models/entities/loai-hinh-dat.entity";
import { ServiceResponse, ResponseStatus } from "@/services/serviceResponse";
import { CreateLoaiHinhDatDTO } from "./dto/create-loai-hinh-dat.dto";

const loaiHinhDatRepo = AppDataSource.getRepository(LoaiHinhDat);

export class LoaiHinhDatService {
    async createLoaiHinhDat(
        data: CreateLoaiHinhDatDTO,
        user: { maNguoiDung: string; vaiTro: string }
    ): Promise<ServiceResponse<any>> {
        if (user.vaiTro !== "admin") {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Bạn không có quyền tạo loại hình đặt",
                null,
                403
            );
        }
        const existed = await loaiHinhDatRepo.findOne({
            where: [
                { tenLoaiDat: data.tenLoaiDat },
                { code: data.code },
            ],
        });
        if (existed) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Tên loại đặt hoặc code đã tồn tại",
                null,
                409
            );
        }
        const loaiHinhDat = loaiHinhDatRepo.create({
            tenLoaiDat: data.tenLoaiDat,
            code: data.code,
        });
        await loaiHinhDatRepo.save(loaiHinhDat);
        return new ServiceResponse(
            ResponseStatus.Success,
            "Tạo loại đặt thành công",
            loaiHinhDat,
            201
        );
    }

    async getAllLoaiHinhDat(): Promise<ServiceResponse<LoaiHinhDat[]>> {
        const result = await loaiHinhDatRepo.find({
            order: { tenLoaiDat: "ASC" },
        });
        return new ServiceResponse(
            ResponseStatus.Success,
            "Lấy danh sách loại hình đặt thành công",
            result,
            200
        );
    }

    async updateLoaiHinhDat(
        maLoaiDat: string,
        tenMoi: string,
        codeMoi: string | undefined,
        user: { maNguoiDung: string; vaiTro: string }
    ): Promise<ServiceResponse<LoaiHinhDat | null>> {
        if (user.vaiTro !== "admin") {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Bạn không có quyền cập nhật loại hình đặt",
                null,
                403
            );
        }

        const loaiHinhDat = await loaiHinhDatRepo.findOneBy({ maLoaiDat });
        if (!loaiHinhDat) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy loại hình đặt",
                null,
                404
            );
        }

        // Kiểm tra trùng code nếu có cập nhật code
        if (codeMoi && codeMoi !== loaiHinhDat.code) {
            const existedCode = await loaiHinhDatRepo.findOne({ where: { code: codeMoi } });
            if (existedCode) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Code đã tồn tại",
                    null,
                    409
                );
            }
            loaiHinhDat.code = codeMoi;
        }
        loaiHinhDat.tenLoaiDat = tenMoi;
        await loaiHinhDatRepo.save(loaiHinhDat);

        return new ServiceResponse(
            ResponseStatus.Success,
            "Cập nhật loại hình đặt thành công",
            loaiHinhDat,
            200
        );
    }

    async deleteLoaiHinhDat(
        maLoaiDat: string,
        user: { maNguoiDung: string; vaiTro: string }
    ): Promise<ServiceResponse<null>> {
        if (user.vaiTro !== "admin") {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Bạn không có quyền xóa loại hình đặt",
                null,
                403
            );
        }

        const loaiHinhDat = await loaiHinhDatRepo.findOneBy({ maLoaiDat });
        if (!loaiHinhDat) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy loại hình đặt",
                null,
                404
            );
        }

        await loaiHinhDatRepo.remove(loaiHinhDat);

        return new ServiceResponse(
            ResponseStatus.Success,
            "Xóa loại hình đặt thành công",
            null,
            200
        );
    }
}

export const loaiHinhDatService = new LoaiHinhDatService();
