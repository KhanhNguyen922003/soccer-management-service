/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { ServiceResponse, ResponseStatus } from "@/services/serviceResponse";
import AppDataSource from "@/config/typeorm.config";
import { SanBong } from "@/models/entities/san-bong.entity";
import { sendApproveSanBongMail, sendDisableSanBongMail } from "@/utils/sendMail.util";

const sanBongRepo = AppDataSource.getRepository(SanBong);

export class AdminService {
    async getAllSanBongForAdmin(filter: {
        search?: string;
        tenSan?: string;
        quanHuyen?: string;
        phuongXa?: string;
        diaChi?: string;
        daDuyet?: boolean | string;
        page?: number;
        limit?: number;
    }): Promise<ServiceResponse<any>> {
        const {
            search,
            tenSan,
            quanHuyen,
            phuongXa,
            diaChi,
            daDuyet,
            page = 1,
            limit = 10,
        } = filter;

        try {
            const query = sanBongRepo
                .createQueryBuilder("sanBong")
                .leftJoinAndSelect("sanBong.chuSan", "chuSan");

            if (search) {
                const searchTrim = search.trim().toLowerCase();
                const keywords = searchTrim.split(/\s+/);
                keywords.forEach((kw, idx) => {
                    query.andWhere(
                        `(LOWER(sanBong.tenSan) LIKE :search_kw${idx} OR LOWER(sanBong.diaChi) LIKE :search_kw${idx})`,
                        { [`search_kw${idx}`]: `%${kw}%` }
                    );
                });
            } else {
                if (tenSan)
                    query.andWhere("LOWER(sanBong.tenSan) LIKE :tenSan", {
                        tenSan: `%${tenSan.trim().toLowerCase()}%`,
                    });
                if (diaChi) {
                    const diaChiTrim = diaChi.trim().toLowerCase();
                    const keywords = diaChiTrim.split(/\s+/);
                    keywords.forEach((kw, idx) => {
                        query.andWhere(
                            `LOWER(sanBong.diaChi) LIKE :diaChi_kw${idx}`,
                            { [`diaChi_kw${idx}`]: `%${kw}%` }
                        );
                    });
                }
            }
            if (quanHuyen)
                query.andWhere("sanBong.quanHuyen = :quanHuyen", { quanHuyen });
            if (phuongXa)
                query.andWhere("sanBong.phuongXa = :phuongXa", { phuongXa });
            if (typeof daDuyet !== "undefined") {
                // Nếu FE truyền lên là string, chuyển về boolean
                const daDuyetBool =
                    typeof daDuyet === "string"
                        ? daDuyet === "true"
                        : !!daDuyet;
                query.andWhere("sanBong.daDuyet = :daDuyet", {
                    daDuyet: daDuyetBool,
                });
            }

            const total = await query.getCount();

            query.skip((page - 1) * limit).take(limit);

            const sanBongs = await query.getMany();

            // const data = sanBongs.map((sb) => ({
            //     ...sb,
            //     chuSanHoTen: sb.chuSan?.hoTen || "",
            //     chuSanEmail: sb.chuSan?.email || "",
            //     chuSanSoDienThoai: sb.chuSan?.soDienThoai || "",
            // }));

            const data = sanBongs.map((sb) => {
                const { chuSan, ...sanBongData } = sb;
                return {
                    ...sanBongData,
                    chuSanHoTen: chuSan?.hoTen || "",
                    chuSanEmail: chuSan?.email || "",
                    chuSanSoDienThoai: chuSan?.soDienThoai || "",
                };
            });

            return new ServiceResponse(
                ResponseStatus.Success,
                "Lấy danh sách sân bóng cho admin thành công",
                { data, total, page, limit },
                200
            );
        } catch (error) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Lấy danh sách sân bóng cho admin thất bại",
                null,
                500
            );
        }
    }

    async approveSanBong(
        maSanBong: string,
        user: { maNguoiDung: string; vaiTro: string }
    ): Promise<ServiceResponse<SanBong | null>> {
        if (user.vaiTro !== "admin") {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Chỉ admin mới được duyệt sân bóng",
                null,
                403
            );
        }

        const sanBong = await sanBongRepo.findOne({
            where: { maSanBong },
            relations: ["chuSan"],
        });

        if (!sanBong) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy sân bóng",
                null,
                404
            );
        }

        sanBong.daDuyet = true;
        sanBong.daBiDisable = false;
        await sanBongRepo.save(sanBong);

        if (sanBong.chuSan?.email) {
            await sendApproveSanBongMail(sanBong.chuSan.email, sanBong.tenSan);
        }

        return new ServiceResponse(
            ResponseStatus.Success,
            "Duyệt sân bóng thành công",
            sanBong,
            200
        );
    }

    async disableSanBong(
        maSanBong: string,
        user: { maNguoiDung: string; vaiTro: string }
    ): Promise<ServiceResponse<any>> {
        // Kiểm tra quyền admin
        if (user.vaiTro !== "admin") {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Chỉ admin mới được thực hiện thao tác này",
                null,
                403
            );
        }

        const sanBong = await sanBongRepo.findOne({
            where: { maSanBong },
            relations: ["chuSan"],
        });

        if (!sanBong) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy sân bóng",
                null,
                404
            );
        }

        sanBong.daDuyet = false;
        sanBong.daBiDisable = true;
        await sanBongRepo.save(sanBong);

        if (sanBong.chuSan?.email) {
            await sendDisableSanBongMail(sanBong.chuSan.email, sanBong.tenSan);
        }

        return new ServiceResponse(
            ResponseStatus.Success,
            "Đã vô hiệu hóa sân bóng thành công",
            sanBong,
            200
        );
    }
}
