/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import AppDataSource from "@/config/typeorm.config";
import { DanhGia } from "@/models/entities/danh-gia.entity";
import { SanBongChiTiet } from "@/models/entities/san-bong-chi-tiet.entity";
import { ChiTietDatSan } from "@/models/entities/chi-tiet-dat-san.entity";
import { ServiceResponse, ResponseStatus } from "@/services/serviceResponse";
import { NguoiDung } from "@/models/entities/nguoi-dung.entity";
import { DanhGiaSanBongInput } from "./dto/danh-gia.dto";

const danhGiaRepo = AppDataSource.getRepository(DanhGia);
const sanBongChiTietRepo = AppDataSource.getRepository(SanBongChiTiet);
const chiTietDatSanRepo = AppDataSource.getRepository(ChiTietDatSan);
const nguoiDungRepo = AppDataSource.getRepository(NguoiDung);

class DanhGiaService {
    async danhGiaSanBong(
        input: DanhGiaSanBongInput
    ): Promise<ServiceResponse<any>> {
        const { sanBongId, nguoiThueId, diemSo, binhLuan } = input;

        // 1. Lấy tất cả mã sân chi tiết thuộc sân bóng cha (dùng query builder)
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

        // 2. Kiểm tra người thuê đã từng thuê ít nhất 1 sân bóng chi tiết chưa (dùng query builder)
        let daThue = null;
        if (sanBongChiTietIds.length > 0) {
            const qb = chiTietDatSanRepo
                .createQueryBuilder("ct")
                .leftJoin("ct.maSanChiTiet", "sct")
                .leftJoin("ct.nguoiThue", "nd")
                .where("ct.trangThaiDatSan = :trangThai", { trangThai: "DA_HOAN_THANH" })
                .andWhere("nd.maNguoiDung = :nguoiThueId", { nguoiThueId })
                .andWhere("sct.maSanChiTiet IN (:...ids)", { ids: sanBongChiTietIds });

            daThue = await qb.getOne();
        }
        if (!daThue) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Bạn chưa từng thuê sân bóng này, không thể đánh giá.",
                null,
                400
            );
        }

        // 3. Lưu đánh giá
        const nguoiThue = await nguoiDungRepo.findOne({
            where: { maNguoiDung: nguoiThueId },
        });
        if (!nguoiThue) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy người thuê.",
                null,
                404
            );
        }
        const sanBong = await AppDataSource.getRepository("SanBong").findOne({
            where: { maSanBong: sanBongId },
        });
        if (!sanBong) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy sân bóng.",
                null,
                404
            );
        }
        const danhGia = danhGiaRepo.create({
            maSanBong: sanBong,
            nguoiThue: nguoiThue,
            diemSo,
            binhLuan,
            thoiGianDanhGia: new Date(),
        });
        await danhGiaRepo.save(danhGia);
        return new ServiceResponse(
            ResponseStatus.Success,
            "Đánh giá thành công",
            danhGia,
            201
        );
    }

    async getDanhGiaSanBong(sanBongId: string, page = 1, limit = 10): Promise<ServiceResponse<any>> {
        const skip = (page - 1) * limit;

        // 1. Lấy tổng số đánh giá (không phân trang)
        const total = await danhGiaRepo
            .createQueryBuilder("dg")
            .leftJoin("dg.maSanBong", "sb")
            .where("sb.maSanBong = :sanBongId", { sanBongId })
            .getCount();

        // 2. Lấy đánh giá theo trang
        const danhGias = await danhGiaRepo
            .createQueryBuilder("dg")
            .leftJoinAndSelect("dg.nguoiThue", "nd")
            .leftJoin("dg.maSanBong", "sb")
            .where("sb.maSanBong = :sanBongId", { sanBongId })
            .orderBy("dg.thoiGianDanhGia", "DESC")
            .skip(skip)
            .take(limit)
            .getMany();

        // 3. Chuẩn bị dữ liệu trả về cho từng đánh giá
        const data = danhGias.map((dg) => ({
            tenNguoiDanhGia: dg.nguoiThue?.hoTen || "An danh",
            avatar: dg.nguoiThue?.avatar || null,
            diemSo: dg.diemSo,
            binhLuan: dg.binhLuan,
            thoiGianDanhGia: dg.thoiGianDanhGia,
        }));

        // 4. Phân phối xếp hạng và điểm trung bình (tính trên toàn bộ)
        const allDanhGias = await danhGiaRepo
            .createQueryBuilder("dg")
            .leftJoin("dg.maSanBong", "sb")
            .where("sb.maSanBong = :sanBongId", { sanBongId })
            .getMany();

        const phanPhoiXepHang: Record<string, number> = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
        allDanhGias.forEach((dg) => {
            const key = String(dg.diemSo);
            if (phanPhoiXepHang[key] !== undefined) {
                phanPhoiXepHang[key]++;
            }
        });

        // 5. Tính điểm trung bình (làm tròn 1 chữ số thập phân)
        const diemTrungBinhDanhGia =
            allDanhGias.length > 0
                ? Number(
                      (
                          Math.round(
                              (allDanhGias.reduce((sum, dg) => sum + dg.diemSo, 0) /
                                  allDanhGias.length) * 10
                          ) / 10
                      )
                  )
                : 0;

        return new ServiceResponse(
            ResponseStatus.Success,
            "Lấy đánh giá thành công",
            {
                count: total,
                page,
                limit,
                data,
                phanPhoiXepHang,
                diemTrungBinhDanhGia,
            },
            200
        );
    }
}

export const danhGiaService = new DanhGiaService();
