/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import AppDataSource from "@/config/typeorm.config";
import { YeuCauRutTien } from "@/models/entities/yeu-cau-rut-tien.entity";
import { NguoiDung } from "@/models/entities/nguoi-dung.entity";
import { ChiTietDatSan } from "@/models/entities/chi-tiet-dat-san.entity";
import { ResponseStatus, ServiceResponse } from "@/services/serviceResponse";
import { CreateYeuCauRutTienDTO } from "./dto/create-yeu-cau-rut-tien.dto";
import { VaiTro } from "@/models/enums/vaiTro.enum";

export class YeuCauRutTienService {
    private repo = AppDataSource.getRepository(YeuCauRutTien);
    private userRepo = AppDataSource.getRepository(NguoiDung);

    async getSoDuNguoiDung(maNguoiDung: string) {
        const user = await this.userRepo.findOneBy({ maNguoiDung });
        if (!user) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy người dùng",
                null,
                404
            );
        }
        // Tổng số dư tài khoản
        const soDuTaiKhoan = Number(user.soDuTaiKhoan);
        let soDuKhaDung = soDuTaiKhoan;
        if (user.vaiTro === VaiTro.CHU_SAN) {
            // Chủ sân: chỉ được rút các đơn đã hoàn thành
            const chiTietDatSanRepo = AppDataSource.getRepository(ChiTietDatSan);
            // Lấy tổng tiền các đơn DA_HOAN_THANH của chủ sân
            const chiTietHoanThanh = await chiTietDatSanRepo
                .createQueryBuilder("ct")
                .leftJoin("ct.maSanChiTiet", "sanChiTiet")
                .leftJoin("sanChiTiet.maSanBong", "sanBong")
                .where("sanBong.chuSan = :maNguoiDung", { maNguoiDung })
                .andWhere("ct.trangThaiDatSan = :trangThai", { trangThai: "DA_HOAN_THANH" })
                .getMany();
            const tongTienHoanThanh = chiTietHoanThanh.reduce((sum, ct) => sum + Number(ct.soTien), 0);

            // Lấy tổng số tiền đã rút thành công (DA_XU_LY)
            const tongTienDaRut = await this.repo
                .createQueryBuilder("yeuCau")
                .select("SUM(yeuCau.soTien)", "sum")
                .where("yeuCau.maNguoiDung = :maNguoiDung", { maNguoiDung })
                .andWhere("yeuCau.trangThai = :trangThai", { trangThai: "DA_XU_LY" })
                .getRawOne();
            const tongTienDaRutNumber = Number(tongTienDaRut?.sum || 0);

            soDuKhaDung = tongTienHoanThanh - tongTienDaRutNumber;
            if (soDuKhaDung < 0) soDuKhaDung = 0;
        }
        return new ServiceResponse(
            ResponseStatus.Success,
            "Lấy số dư thành công",
            { soDuTaiKhoan, soDuKhaDung },
            200
        );
    }

    async createRutTien(
        maNguoiDung: string,
        yeuCauRutTienDTO: CreateYeuCauRutTienDTO
    ): Promise<ServiceResponse<any>> {
        const { soTien, tenNganHang, soTaiKhoan, moTa } = yeuCauRutTienDTO;
        const user = await this.userRepo.findOneBy({ maNguoiDung });
        if (!user) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy người dùng",
                null,
                404
            );
        }
        if (soTien <= 0) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Số tiền rút phải lớn hơn 0",
                null,
                400
            );
        }
        let soDuKiemTra = Number(user.soDuTaiKhoan);
        if (user.vaiTro === VaiTro.CHU_SAN) {
            // Chủ sân: chỉ được rút các đơn đã hoàn thành
            const chiTietDatSanRepo =
                AppDataSource.getRepository(ChiTietDatSan);
            const chiTietHoanThanh = await chiTietDatSanRepo
                .createQueryBuilder("ct")
                .leftJoin("ct.maSanChiTiet", "sanChiTiet")
                .leftJoin("sanChiTiet.maSanBong", "sanBong")
                .where("sanBong.chuSan = :maNguoiDung", { maNguoiDung })
                .andWhere("ct.trangThaiDatSan = :trangThai", {
                    trangThai: "DA_HOAN_THANH",
                })
                .getMany();
            soDuKiemTra = chiTietHoanThanh.reduce(
                (sum, ct) => sum + Number(ct.soTien),
                0
            );
        }
        if (soTien > soDuKiemTra) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                `Số tiền rút vượt quá số dư khả dụng (${soDuKiemTra.toLocaleString()}đ)`,
                null,
                400
            );
        }
        const yeuCau = this.repo.create({
            maNguoiDung: user,
            thoiGianRut: new Date(),
            soTien,
            tenNganHang,
            soTaiKhoan,
            moTa,
            trangThai: "CHO_XU_LY",
            maGiaoDich: "YC" + Date.now(),
        });
        await this.repo.save(yeuCau);

        if (
            yeuCau.maNguoiDung &&
            typeof yeuCau.maNguoiDung === "object" &&
            "matKhau" in yeuCau.maNguoiDung
        ) {
            const nguoiDungAny = yeuCau.maNguoiDung as any;
            delete nguoiDungAny.matKhau;
            yeuCau.maNguoiDung = nguoiDungAny;
        }
        return new ServiceResponse(
            ResponseStatus.Success,
            "Tạo yêu cầu rút tiền thành công",
            yeuCau,
            201
        );
    }

    async getAllYeuCauRutTien(
        page = 1,
        limit = 20,
        currentUser?: NguoiDung,
        search?: string,
        trangThai?: string, // đổi từ vaiTro sang trangThai
        fromDate?: string,
        toDate?: string
    ): Promise<ServiceResponse<any>> {
        // Nếu truyền vào currentUser và không phải admin thì trả về lỗi
        if (currentUser && currentUser.vaiTro !== VaiTro.ADMIN) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Chỉ admin mới có quyền xem danh sách yêu cầu rút tiền",
                null,
                403
            );
        }
        const qb = this.repo.createQueryBuilder("yeuCau")
            .leftJoinAndSelect("yeuCau.maNguoiDung", "nguoiDung")
            .orderBy("yeuCau.thoiGianRut", "DESC")
            .skip((page - 1) * limit)
            .take(limit);
        if (search) {
            // Tìm kiếm không phân biệt hoa thường, trim dấu cách
            const searchValue = `%${search.trim().toLowerCase()}%`;
            qb.andWhere("LOWER(TRIM(nguoiDung.hoTen)) LIKE :search", { search: searchValue });
        }
        if (trangThai) {
            qb.andWhere("yeuCau.trangThai = :trangThai", { trangThai });
        }
        if (fromDate) {
            qb.andWhere("yeuCau.thoiGianRut >= :fromDate", { fromDate });
        }
        if (toDate) {
            qb.andWhere("yeuCau.thoiGianRut <= :toDate", { toDate });
        }
        const [data, total] = await qb.getManyAndCount();
        // Xóa trường matKhau khỏi từng maNguoiDung trong danh sách trả về
        const dataSafe = data.map((item) => {
            if (
                item.maNguoiDung &&
                typeof item.maNguoiDung === "object" &&
                "matKhau" in item.maNguoiDung
            ) {
                const nguoiDungAny = item.maNguoiDung as any;
                delete nguoiDungAny.matKhau;
                item.maNguoiDung = nguoiDungAny;
            }
            // Thêm trường soTienThucTeCanChuyen cho chủ sân
            let soTienThucTeCanChuyen = item.soTien;
            if (item.maNguoiDung && item.maNguoiDung.vaiTro === VaiTro.CHU_SAN) {
                soTienThucTeCanChuyen = Math.floor(item.soTien * 0.9);
            }
            return {
                ...item,
                soTienThucTeCanChuyen,
            };
        });
        return new ServiceResponse(
            ResponseStatus.Success,
            "Lấy danh sách yêu cầu rút tiền thành công",
            { total, page, limit, data: dataSafe },
            200
        );
    }

    async xacNhanRutTien(
        maYeuCau: string
    ): Promise<ServiceResponse<any>> {
        const yeuCau = await this.repo.findOne({
            where: { maYeuCau },
            relations: ["maNguoiDung"],
        });
        if (!yeuCau) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy yêu cầu rút tiền",
                null,
                404
            );
        }
        if (yeuCau.trangThai !== "CHO_XU_LY") {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Yêu cầu đã xử lý",
                null,
                400
            );
        }
        const user = yeuCau.maNguoiDung;
        if (!user) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy người dùng",
                null,
                404
            );
        }
        // Nếu là chủ sân, chỉ cho rút tiền từ các đơn đã hoàn thành
        if (user.vaiTro === VaiTro.CHU_SAN) {
            // Tính tổng số tiền các đơn đã hoàn thành
            const chiTietDatSanRepo = AppDataSource.getRepository(ChiTietDatSan);
            const chiTietHoanThanh = await chiTietDatSanRepo
                .createQueryBuilder("ct")
                .leftJoin("ct.maSanChiTiet", "sanChiTiet")
                .leftJoin("sanChiTiet.maSanBong", "sanBong")
                .where("sanBong.chuSan = :maNguoiDung", { maNguoiDung: user.maNguoiDung })
                .andWhere("ct.trangThaiDatSan = :trangThai", { trangThai: "DA_HOAN_THANH" })
                .getMany();
            const soDuKhaDung = chiTietHoanThanh.reduce((sum, ct) => sum + Number(ct.soTien), 0);
            if (Number(yeuCau.soTien) > soDuKhaDung) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    `Số tiền rút vượt quá số dư khả dụng cho chủ sân (${soDuKhaDung.toLocaleString()}đ)`,
                    null,
                    400
                );
            }
        }
        if (Number(user.soDuTaiKhoan) < Number(yeuCau.soTien)) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Số dư không đủ",
                null,
                400
            );
        }
        // Trừ số dư
        user.soDuTaiKhoan = Number(user.soDuTaiKhoan) - Number(yeuCau.soTien);
        await this.userRepo.save(user);
        yeuCau.trangThai = "DA_XU_LY";
        await this.repo.save(yeuCau);
        return new ServiceResponse(
            ResponseStatus.Success,
            "Đã xác nhận chuyển tiền và trừ số dư",
            yeuCau,
            200
        );
    }
}

export const yeuCauRutTienService = new YeuCauRutTienService();
