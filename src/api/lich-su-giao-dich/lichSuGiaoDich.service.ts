/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import AppDataSource from "@/config/typeorm.config";
import { NapTien } from "@/models/entities/nap-tien.entity";
import { NguoiDung } from "@/models/entities/nguoi-dung.entity";
import { ServiceResponse, ResponseStatus } from "@/services/serviceResponse";

const napTienRepo = AppDataSource.getRepository(NapTien);
const nguoiDungRepo = AppDataSource.getRepository(NguoiDung);

export class LichSuGiaoDichService {
    async getLichSuNapTien(maNguoiDung: string, page = 1, limit = 10) {
        const user = await nguoiDungRepo.findOne({ where: { maNguoiDung } });
        if (!user) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy người dùng",
                null,
                404
            );
        }
        const [lichSu, total] = await napTienRepo.findAndCount({
            where: { nguoiNap: { maNguoiDung } },
            order: { thoiGianNap: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
        return new ServiceResponse(
            ResponseStatus.Success,
            "Lấy lịch sử nạp tiền thành công",
            {
                data: lichSu,
                total,
                page,
                limit,
            },
            200
        );
    }
}
