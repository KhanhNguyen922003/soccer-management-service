/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import AppDataSource from "@/config/typeorm.config";
import { LoaiSan } from "@/models/entities/loai-san.entity";
import { ResponseStatus, ServiceResponse } from "@/services/serviceResponse";

const loaiSanRepo = AppDataSource.getRepository(LoaiSan);

export class LoaiSanService {
    async createLoaiSan(tenLoaiSan: string, user : { maNguoiDung: string, vaiTro: string }): Promise<ServiceResponse<LoaiSan | null>> {
        if (user.vaiTro !== "admin") {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Bạn không có quyền tạo loại sân",
                null,
                403
            );
        }

        const loaiSan = loaiSanRepo.create({ tenLoaiSan });
        await loaiSanRepo.save(loaiSan);

        return new ServiceResponse(
            ResponseStatus.Success,
            "Tạo loại sân thành công",
            loaiSan,
            201
        )
    }
    
    async getAllLoaiSan(): Promise<ServiceResponse<LoaiSan[]>> {
        const result = await loaiSanRepo.find({
            order: {
                tenLoaiSan: "ASC",
            },
        });
        return new ServiceResponse(
            ResponseStatus.Success,
            "Lấy danh sách loại sân thành công",
            result,
            200
        )
    }

    async deleteLoaiSan(maLoaiSan: string, user: { maNguoiDung: string; vaiTro: string }): Promise<ServiceResponse<null>> {
        if (user.vaiTro !== "admin") {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Bạn không có quyền xóa loại sân",
                null,
                403
            );
        }

        const loaiSan = await loaiSanRepo.findOneBy({ maLoaiSan });

        if (!loaiSan) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy loại sân",
                null,
                404
            );
        }

        await loaiSanRepo.remove(loaiSan);

        return new ServiceResponse(
            ResponseStatus.Success,
            "Xóa loại sân thành công",
            null,
            200
        );
    }

    async updateLoaiSan(
        maLoaiSan: string,
        tenMoi: string,
        user: { maNguoiDung: string; vaiTro: string }
    ): Promise<ServiceResponse<LoaiSan | null>> {
        if (user.vaiTro !== "admin") {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Bạn không có quyền cập nhật loại sân",
                null,
                403
            );
        }

        const loaiSan = await loaiSanRepo.findOneBy({ maLoaiSan });

        if (!loaiSan) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy loại sân",
                null,
                404
            );
        }

        loaiSan.tenLoaiSan = tenMoi;
        await loaiSanRepo.save(loaiSan);

        return new ServiceResponse(
            ResponseStatus.Success,
            "Cập nhật loại sân thành công",
            loaiSan,
            200
        );
    }
}