/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import AppDataSource from "@/config/typeorm.config";
import { ChiTietDatSan } from "@/models/entities/chi-tiet-dat-san.entity";
import { SanBongChiTiet } from "@/models/entities/san-bong-chi-tiet.entity";
import { NguoiDung } from "@/models/entities/nguoi-dung.entity";
import { ServiceResponse, ResponseStatus } from "@/services/serviceResponse";
import { BaoCao } from "@/models/entities/bao-cao.entity";
import { SanBong } from "@/models/entities/san-bong.entity";

const sanBongChiTietRepo = AppDataSource.getRepository(SanBongChiTiet);
const chiTietDatSanRepo = AppDataSource.getRepository(ChiTietDatSan);
const nguoiDungRepo = AppDataSource.getRepository(NguoiDung);
const baoCaoRepo = AppDataSource.getRepository(BaoCao);

class BaoCaoService {
    async baoCaoSanBong(input: {
        sanBongId: string;
        nguoiThueId: string;
        lyDo: string;
    }) {
        const { sanBongId, nguoiThueId, lyDo } = input;
        // 1. Lấy tất cả mã sân chi tiết thuộc sân bóng cha
        const sanBongChiTietList = await sanBongChiTietRepo
            .createQueryBuilder("sct")
            .leftJoin("sct.maSanBong", "sb")
            .where("sb.maSanBong = :sanBongId", { sanBongId })
            .getMany();
        const sanBongChiTietIds = sanBongChiTietList.map((s) => s.maSanChiTiet);
        if (sanBongChiTietIds.length === 0) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy sân chi tiết nào thuộc sân bóng này.",
                null,
                404
            );
        }
        // 2. Kiểm tra người thuê đã từng thuê ít nhất 1 sân bóng chi tiết chưa
        let daThue = null;
        if (sanBongChiTietIds.length > 0) {
            const qb = chiTietDatSanRepo
                .createQueryBuilder("ct")
                .leftJoin("ct.maSanChiTiet", "sct")
                .leftJoin("ct.nguoiThue", "nd")
                .where("ct.trangThaiDatSan = :trangThai", {
                    trangThai: "DA_HOAN_THANH",
                })
                .andWhere("nd.maNguoiDung = :nguoiThueId", { nguoiThueId })
                .andWhere("sct.maSanChiTiet IN (:...ids)", {
                    ids: sanBongChiTietIds,
                });
            daThue = await qb.getOne();
        }
        if (!daThue) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Bạn chưa từng thuê sân bóng này, không thể báo cáo.",
                null,
                400
            );
        }
        // 3. Lưu báo cáo vào DB
        const nguoiThue = await nguoiDungRepo.findOne({
            where: { maNguoiDung: nguoiThueId },
        });
        const sanBong = await AppDataSource.getRepository(SanBong).findOne({
            where: { maSanBong: sanBongId },
        });
        if (!nguoiThue || !sanBong) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy người thuê hoặc sân bóng.",
                null,
                404
            );
        }
        const baoCao = baoCaoRepo.create({
            maSanBong: sanBong,
            nguoiThue: nguoiThue,
            lyDo,
            thoiGianBaoCao: new Date(),
        });
        await baoCaoRepo.save(baoCao);
        return new ServiceResponse(
            ResponseStatus.Success,
            "Báo cáo thành công",
            baoCao,
            201
        );
    }

    async getAllBaoCao({
        page = 1,
        limit = 20,
        search,
        fromDate,
        toDate,
    }: {
        page?: number;
        limit?: number;
        search?: string;
        fromDate?: string;
        toDate?: string;
    }) {
        const qb = baoCaoRepo
            .createQueryBuilder("baoCao")
            .leftJoinAndSelect("baoCao.nguoiThue", "nguoiThue")
            .leftJoinAndSelect("baoCao.maSanBong", "sanBong")
            .orderBy("baoCao.thoiGianBaoCao", "DESC")
            .skip((page - 1) * limit)
            .take(limit);
        if (search) {
            const searchValue = `%${search.trim().toLowerCase()}%`;
            qb.andWhere(
                "LOWER(TRIM(sanBong.tenSan)) LIKE :search OR LOWER(TRIM(nguoiThue.hoTen)) LIKE :search",
                { search: searchValue }
            );
        }
        if (fromDate) {
            qb.andWhere("baoCao.thoiGianBaoCao >= :fromDate", { fromDate });
        }
        if (toDate) {
            qb.andWhere("baoCao.thoiGianBaoCao <= :toDate", { toDate });
        }
        const [data, total] = await qb.getManyAndCount();
        // Xóa trường matKhau khỏi nguoiThue
        const dataSafe = data.map((item) => {
            if (
                item.nguoiThue &&
                typeof item.nguoiThue === "object" &&
                "matKhau" in item.nguoiThue
            ) {
                const nguoiDungAny = item.nguoiThue as any;
                delete nguoiDungAny.matKhau;
                item.nguoiThue = nguoiDungAny;
            }
            return item;
        });
        return new ServiceResponse(
            ResponseStatus.Success,
            "Lấy danh sách báo cáo thành công",
            { total, page, limit, data: dataSafe },
            200
        );
    }
}

export const baoCaoService = new BaoCaoService();
