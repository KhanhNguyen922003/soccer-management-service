/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import AppDataSource from "@/config/typeorm.config";
import { DatSan } from "@/models/entities/dat-san.entity";
import { ChiTietDatSan } from "@/models/entities/chi-tiet-dat-san.entity";
import { SanBongChiTiet } from "@/models/entities/san-bong-chi-tiet.entity";
import { NguoiDung } from "@/models/entities/nguoi-dung.entity";
import { LoaiHinhDat } from "@/models/entities/loai-hinh-dat.entity";
import { ResponseStatus, ServiceResponse } from "@/services/serviceResponse";
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
dayjs.extend(quarterOfYear);
import { DatSanInputDTO, LichDatDTO } from "./dto/dat-san.dto";
import { Equal, Like, In } from "typeorm";
import { ReportDashboardData } from "./dto/report-dashboard.dto";
import { sendMailNotifyChuSan } from "@/utils/sendMail.util";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);
import { DatSanTheoThangInputDTO } from "./dto/dat-san-theo-thang.dto";

const datSanRepo = AppDataSource.getRepository(DatSan);
const chiTietDatSanRepo = AppDataSource.getRepository(ChiTietDatSan);
const sanBongChiTietRepo = AppDataSource.getRepository(SanBongChiTiet);
const nguoiDungRepo = AppDataSource.getRepository(NguoiDung);
const loaiHinhDatRepo = AppDataSource.getRepository(LoaiHinhDat);

export class DatSanService {
    async datSan(input: DatSanInputDTO): Promise<ServiceResponse<any>> {
        const { nguoiThueId, maSanChiTiet, maLoaiDat, soTien, lichDat } = input;
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // Kiểm tra người thuê
            const nguoiThue = await queryRunner.manager.findOne(NguoiDung, {
                where: { maNguoiDung: nguoiThueId },
            });
            if (!nguoiThue) {
                await queryRunner.rollbackTransaction();
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Không tìm thấy người thuê",
                    null,
                    404
                );
            }
            // Kiểm tra sân chi tiết
            const sanChiTiet = await queryRunner.manager.findOne(
                SanBongChiTiet,
                { where: { maSanChiTiet } }
            );
            if (!sanChiTiet) {
                await queryRunner.rollbackTransaction();
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Không tìm thấy sân chi tiết",
                    null,
                    404
                );
            }
            // Accept maLoaiDat as code (semantic string) or UUID
            let loaiHinhDat: LoaiHinhDat | null = null;
            if (maLoaiDat && maLoaiDat.length <= 20) {
                // likely a code, not UUID
                loaiHinhDat = await queryRunner.manager.findOne(LoaiHinhDat, {
                    where: { code: maLoaiDat },
                });
            } else {
                loaiHinhDat = await queryRunner.manager.findOne(LoaiHinhDat, {
                    where: { maLoaiDat },
                });
            }
            if (!loaiHinhDat) {
                await queryRunner.rollbackTransaction();
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Không tìm thấy loại hình đặt",
                    null,
                    404
                );
            }
            // Group lichDat by ngayDat
            const lichDatByDate: Record<string, LichDatDTO[]> = {};
            for (const lich of lichDat) {
                if (!lichDatByDate[lich.ngayDat]) lichDatByDate[lich.ngayDat] = [];
                lichDatByDate[lich.ngayDat].push(lich);
            }
            let tongTien = 0;
            let allDatSan: DatSan[] = [];
            let allChiTiet: ChiTietDatSan[] = [];
            // Tính tổng tiền trước khi đặt để kiểm tra số dư
            for (const [ngayDat, slots] of Object.entries(lichDatByDate)) {
                let soTienNgay = 0;
                for (const lich of slots) {
                    const [gioStr, phutStr] = lich.gioBatDau.split(":");
                    const gioBatDau = parseInt(gioStr, 10);
                    const phutBatDau = parseInt(phutStr, 10);
                    const openingMinutes = gioBatDau * 60 + phutBatDau;
                    let eveningThreshold = 17 * 60;
                    if (phutBatDau === 30) eveningThreshold = 17 * 60 + 30;
                    let giaSlot = 0;
                    if (openingMinutes >= eveningThreshold) {
                        giaSlot = Number(sanChiTiet.giaThueBuoiToi);
                    } else {
                        giaSlot = Number(sanChiTiet.giaThueBuoiSang);
                    }
                    soTienNgay += giaSlot;
                }
                tongTien += soTienNgay;
            }
            // Kiểm tra số dư tài khoản trước khi đặt
            if (Number(nguoiThue.soDuTaiKhoan) < Number(tongTien)) {
                await queryRunner.rollbackTransaction();
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Số dư tài khoản không đủ để đặt sân",
                    null,
                    400
                );
            }
            // Đặt sân từng ngày như cũ
            for (const [ngayDat, slots] of Object.entries(lichDatByDate)) {
                // Kiểm tra trùng lịch cho từng slot trong ngày
                for (const lich of slots) {
                    const conflict = await queryRunner.manager
                        .createQueryBuilder(ChiTietDatSan, "ct")
                        .leftJoin("ct.maSanChiTiet", "sanChiTiet")
                        .leftJoin("ct.maDatSan", "datSan")
                        .where("ct.maSanChiTiet = :maSanChiTiet", { maSanChiTiet })
                        .andWhere(
                            "ct.gioBatDau < :gioKetThuc AND ct.gioKetThuc > :gioBatDau",
                            {
                                gioBatDau: lich.gioBatDau,
                                gioKetThuc: lich.gioKetThuc,
                            }
                        )
                        .andWhere("datSan.ngayDat = :ngayDat", {
                            ngayDat: dayjs(ngayDat).toDate(),
                        })
                        .andWhere("ct.trangThaiDatSan = :trangThaiDatSan", { trangThaiDatSan: 'DA_DAT' })
                        .getOne();
                    if (conflict) {
                        await queryRunner.rollbackTransaction();
                        return new ServiceResponse(
                            ResponseStatus.Failed,
                            `Khung giờ ${lich.gioBatDau} - ${lich.gioKetThuc} ngày ${ngayDat} đã có người đặt!`,
                            null,
                            409
                        );
                    }
                }
                // Tính tổng tiền cho ngày này
                let soTienNgay = 0;
                for (const lich of slots) {
                    const [gioStr, phutStr] = lich.gioBatDau.split(":");
                    const gioBatDau = parseInt(gioStr, 10);
                    const phutBatDau = parseInt(phutStr, 10);
                    const openingMinutes = gioBatDau * 60 + phutBatDau;
                    let eveningThreshold = 17 * 60;
                    if (phutBatDau === 30) eveningThreshold = 17 * 60 + 30;
                    let giaSlot = 0;
                    if (openingMinutes >= eveningThreshold) {
                        giaSlot = Number(sanChiTiet.giaThueBuoiToi);
                    } else {
                        giaSlot = Number(sanChiTiet.giaThueBuoiSang);
                    }
                    soTienNgay += giaSlot;
                }
                // Tạo DatSan cho ngày này
                const datSan = queryRunner.manager.create(DatSan, {
                    nguoiThue,
                    ngayDat: dayjs(ngayDat).toDate(),
                    ngayThanhToan: new Date(),
                    soTien: soTienNgay,
                });
                await queryRunner.manager.save(datSan);
                // Tạo các slot cho ngày này
                for (const lich of slots) {
                    const [gioStr, phutStr] = lich.gioBatDau.split(":");
                    const gioBatDau = parseInt(gioStr, 10);
                    const phutBatDau = parseInt(phutStr, 10);
                    const openingMinutes = gioBatDau * 60 + phutBatDau;
                    let eveningThreshold = 17 * 60;
                    if (phutBatDau === 30) eveningThreshold = 17 * 60 + 30;
                    let giaSlot = 0;
                    if (openingMinutes >= eveningThreshold) {
                        giaSlot = Number(sanChiTiet.giaThueBuoiToi);
                    } else {
                        giaSlot = Number(sanChiTiet.giaThueBuoiSang);
                    }
                    const chiTietDatSan = queryRunner.manager.create(
                        ChiTietDatSan,
                        {
                            maDatSan: datSan,
                            maSanChiTiet: sanChiTiet,
                            nguoiThue,
                            maLoaiDat: loaiHinhDat,
                            gioBatDau: lich.gioBatDau,
                            gioKetThuc: lich.gioKetThuc,
                            trangThaiDatSan: "DA_DAT",
                            coVanDe: false,
                            soTien: giaSlot,
                        }
                    );
                    await queryRunner.manager.save(chiTietDatSan);
                    allChiTiet.push(chiTietDatSan);
                }
                allDatSan.push(datSan);
            }
            // Trừ tiền người thuê
            nguoiThue.soDuTaiKhoan = Number(nguoiThue.soDuTaiKhoan) - Number(tongTien);
            if (isNaN(nguoiThue.soDuTaiKhoan) || nguoiThue.soDuTaiKhoan < 0 || nguoiThue.soDuTaiKhoan > 9999999999) {
                await queryRunner.rollbackTransaction();
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Số dư tài khoản không hợp lệ sau khi trừ tiền",
                    null,
                    400
                );
            }
            await queryRunner.manager.save(nguoiThue);
            // Cộng tiền cho chủ sân
            const sanBong = await queryRunner.manager.findOne(SanBongChiTiet, {
                where: { maSanChiTiet },
                relations: ["maSanBong", "maSanBong.chuSan"],
            });
            if (sanBong && sanBong.maSanBong && sanBong.maSanBong.chuSan) {
                sanBong.maSanBong.chuSan.soDuTaiKhoan =
                    Number(sanBong.maSanBong.chuSan.soDuTaiKhoan) + Number(tongTien);
                if (
                    isNaN(sanBong.maSanBong.chuSan.soDuTaiKhoan) ||
                    sanBong.maSanBong.chuSan.soDuTaiKhoan < 0 ||
                    sanBong.maSanBong.chuSan.soDuTaiKhoan > 9999999999
                ) {
                    await queryRunner.rollbackTransaction();
                    return new ServiceResponse(
                        ResponseStatus.Failed,
                        "Số dư chủ sân vượt quá giới hạn",
                        null,
                        400
                    );
                }
                await queryRunner.manager.save(sanBong.maSanBong.chuSan);
            } else {
                await queryRunner.rollbackTransaction();
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Không tìm thấy chủ sân",
                    null,
                    404
                );
            }
            await queryRunner.commitTransaction();
            // Gửi mail cho chủ sân (gom tất cả slot)
            try {
                if (allChiTiet.length > 0) {
                    const chiTietWithRelations = await chiTietDatSanRepo.find({
                        where: { maChiTietDatSan: In(allChiTiet.map(ct => ct.maChiTietDatSan)) },
                        relations: [
                            "maSanChiTiet",
                            "maSanChiTiet.maSanBong",
                            "maSanChiTiet.maSanBong.chuSan",
                            "maDatSan",
                        ],
                    });
                    const firstSlot = chiTietWithRelations[0];
                    const chuSan = firstSlot.maSanChiTiet?.maSanBong?.chuSan;
                    const tenSan = firstSlot.maSanChiTiet?.maSanBong?.tenSan || "";
                    if (chuSan?.email) {
                        const slotList = chiTietWithRelations.map((ct: any) => ({
                            tenSanChiTiet: ct.maSanChiTiet?.tenSanChiTiet,
                            ngayDat: dayjs(ct.maDatSan.ngayDat).format("YYYY-MM-DD"),
                            gioBatDau: ct.gioBatDau,
                            gioKetThuc: ct.gioKetThuc,
                        }));
                        await sendMailNotifyChuSan(
                            chuSan.email,
                            chuSan.hoTen,
                            tenSan,
                            nguoiThue.hoTen,
                            nguoiThue.soDienThoai,
                            slotList
                        );
                    }
                }
            } catch (mailErr) {
                console.error("[DAT SAN] Lỗi gửi mail cho chủ sân (KHÔNG ảnh hưởng kết quả API):", mailErr);
            }
            // Loại bỏ trường matKhau khỏi nguoiThue khi trả về
            const { matKhau, ...nguoiThueResponse } = nguoiThue;
            const allDatSanResponse = allDatSan.map(ds => {
                if (ds.nguoiThue && ds.nguoiThue.matKhau !== undefined) {
                    const { matKhau, ...nguoiThueNoPass } = ds.nguoiThue;
                    return { ...ds, nguoiThue: nguoiThueNoPass };
                }
                return ds;
            });
            return new ServiceResponse(
                ResponseStatus.Success,
                "Đặt sân thành công",
                {
                    datSan: allDatSanResponse,
                    chiTietDatSan: allChiTiet,
                    nguoiThue: nguoiThueResponse,
                },
                201
            );
        } catch (err) {
            await queryRunner.rollbackTransaction();
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Có lỗi xảy ra khi đặt sân",
                null,
                500
            );
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Đặt sân theo tháng (dài hạn, nhiều buổi/tuần)
     * @param input
     */
    async datSanTheoThang(
        input: DatSanTheoThangInputDTO
    ): Promise<ServiceResponse<any>> {
        // Map thuTrongTuan -> ngayTrongTuan để dùng chung logic cũ
        const {
            nguoiThueId,
            maSanChiTiet,
            maLoaiDat,
            gioBatDau,
            gioKetThuc,
            ngayBatDau,
            ngayKetThuc,
            thuTrongTuan,
            ghiChu,
        } = input;
        const ngayTrongTuan = thuTrongTuan;

        // Validate số buổi/tuần
        if (!ngayTrongTuan || ngayTrongTuan.length < 2) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Đặt tháng phải chọn ít nhất 2 buổi/tuần",
                null,
                400
            );
        }
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let allDatSan: DatSan[] = [];
            let allChiTiet: ChiTietDatSan[] = [];
            // Kiểm tra người thuê
            const nguoiThue = await queryRunner.manager.findOne(NguoiDung, {
                where: { maNguoiDung: nguoiThueId },
            });
            if (!nguoiThue) {
                await queryRunner.rollbackTransaction();
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Không tìm thấy người thuê",
                    null,
                    404
                );
            }
            // Kiểm tra sân chi tiết
            const sanChiTiet = await queryRunner.manager.findOne(
                SanBongChiTiet,
                { where: { maSanChiTiet } }
            );
            if (!sanChiTiet) {
                await queryRunner.rollbackTransaction();
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Không tìm thấy sân chi tiết",
                    null,
                    404
                );
            }
            // Kiểm tra loại hình đặt (chấp nhận code hoặc uuid)
            let loaiHinhDat: LoaiHinhDat | null = null;
            if (maLoaiDat && maLoaiDat.length <= 20) {
                // likely a code, not UUID
                loaiHinhDat = await queryRunner.manager.findOne(LoaiHinhDat, {
                    where: { code: maLoaiDat },
                });
            } else {
                loaiHinhDat = await queryRunner.manager.findOne(LoaiHinhDat, {
                    where: { maLoaiDat },
                });
            }
            if (!loaiHinhDat) {
                await queryRunner.rollbackTransaction();
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Không tìm thấy loại hình đặt",
                    null,
                    404
                );
            }
            // Sinh danh sách ngày thực tế trong tháng ứng với các thứ đã chọn
            const lichDat: Array<{
                ngayDat: string;
                gioBatDau: string;
                gioKetThuc: string;
            }> = [];
            let d = dayjs(ngayBatDau);
            const end = dayjs(ngayKetThuc);
            // Đảm bảo không lặp ngày, chỉ lấy đúng các ngày trong tuần đã chọn
            while (d.isSameOrBefore(end, "day")) {
                const thu = d.day(); // 0=Chủ nhật, 1=Thứ 2, ..., 6=Thứ 7
                const thuTrongTuanValue = thu === 0 ? 7 : thu; // 1=Thứ 2, ..., 7=Chủ nhật
                if (ngayTrongTuan.includes(thuTrongTuanValue)) {
                    // Kiểm tra đã có ngày này chưa (tránh lặp)
                    if (!lichDat.some(item => item.ngayDat === d.format("YYYY-MM-DD") && item.gioBatDau === gioBatDau && item.gioKetThuc === gioKetThuc)) {
                        lichDat.push({
                            ngayDat: d.format("YYYY-MM-DD"),
                            gioBatDau,
                            gioKetThuc,
                        });
                    }
                }
                d = d.add(1, "day");
            }
            if (lichDat.length === 0) {
                await queryRunner.rollbackTransaction();
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Không có ngày nào phù hợp trong tháng",
                    null,
                    400
                );
            }
            // Sau khi sinh lichDat, lọc unique theo ngày + giờ để tránh lặp slot
            const uniqueLichDat = Array.from(
                new Map(lichDat.map(item => [item.ngayDat + '-' + item.gioBatDau + '-' + item.gioKetThuc, item])).values()
            );
            // Kiểm tra trùng lịch cho tất cả lịch đặt
            for (const lich of uniqueLichDat) {
                const conflict = await queryRunner.manager
                    .createQueryBuilder(ChiTietDatSan, "ct")
                    .leftJoin("ct.maSanChiTiet", "sanChiTiet")
                    .leftJoin("ct.maDatSan", "datSan")
                    .where("ct.maSanChiTiet = :maSanChiTiet", { maSanChiTiet })
                    .andWhere(
                        "ct.gioBatDau < :gioKetThuc AND ct.gioKetThuc > :gioBatDau",
                        {
                            gioBatDau: lich.gioBatDau,
                            gioKetThuc: lich.gioKetThuc,
                        }
                    )
                    .andWhere("datSan.ngayDat = :ngayDat", {
                        ngayDat: dayjs(lich.ngayDat).toDate(),
                    })
                    .andWhere("ct.trangThaiDatSan = :trangThaiDatSan", { trangThaiDatSan: 'DA_DAT' })
                    .getOne();
                if (conflict) {
                    await queryRunner.rollbackTransaction();
                    return new ServiceResponse(
                        ResponseStatus.Failed,
                        `Khung giờ ${lich.gioBatDau} - ${lich.gioKetThuc} ngày ${lich.ngayDat} đã có người đặt! Vui lòng chọn một ngày, thứ trong tuần hoặc khung giờ khác để đặt sân.`,
                        null,
                        409
                    );
                }
            }
            // Tính tổng tiền các slot
            let tongTien = 0;
            // Gom slot theo ngày để tạo DatSan từng ngày
            const lichDatByDate: Record<string, Array<{ngayDat:string, gioBatDau:string, gioKetThuc:string}>> = {};
            for (const lich of uniqueLichDat) {
                if (!lichDatByDate[lich.ngayDat]) lichDatByDate[lich.ngayDat] = [];
                lichDatByDate[lich.ngayDat].push(lich);
            }
            for (const [ngayDat, slots] of Object.entries(lichDatByDate)) {
                let soTienNgay = 0;
                for (const lich of slots) {
                    const [gioStr, phutStr] = lich.gioBatDau.split(":");
                    const gioBatDau = parseInt(gioStr, 10);
                    const phutBatDau = parseInt(phutStr, 10);
                    const openingMinutes = gioBatDau * 60 + phutBatDau;
                    let eveningThreshold = 17 * 60;
                    if (phutBatDau === 30) eveningThreshold = 17 * 60 + 30;
                    let giaSlot = 0;
                    if (openingMinutes >= eveningThreshold) {
                        giaSlot = Number(sanChiTiet.giaThueBuoiToi);
                    } else {
                        giaSlot = Number(sanChiTiet.giaThueBuoiSang);
                    }
                    soTienNgay += giaSlot;
                }
                tongTien += soTienNgay;
            }
            // Áp dụng giảm giá theo số buổi/tuần
            const discountMap: Record<number, number> = {
                2: 0.05,
                3: 0.07,
                4: 0.1,
                5: 0.12,
                6: 0.14,
                7: 0.15,
            };
            const discount = discountMap[ngayTrongTuan.length] || 0;
            const tongTienSauGiam = Math.round(tongTien * (1 - discount));
            // Trừ tiền người thuê
            nguoiThue.soDuTaiKhoan = Number(nguoiThue.soDuTaiKhoan) - Number(tongTienSauGiam);
            await queryRunner.manager.save(nguoiThue);
            // Tạo DatSan và ChiTietDatSan cho từng ngày
            for (const [ngayDat, slots] of Object.entries(lichDatByDate)) {
                let soTienNgay = 0;
                for (const lich of slots) {
                    const [gioStr, phutStr] = lich.gioBatDau.split(":");
                    const gioBatDau = parseInt(gioStr, 10);
                    const phutBatDau = parseInt(phutStr, 10);
                    const openingMinutes = gioBatDau * 60 + phutBatDau;
                    let eveningThreshold = 17 * 60;
                    if (phutBatDau === 30) eveningThreshold = 17 * 60 + 30;
                    let giaSlot = 0;
                    if (openingMinutes >= eveningThreshold) {
                        giaSlot = Number(sanChiTiet.giaThueBuoiToi);
                    } else {
                        giaSlot = Number(sanChiTiet.giaThueBuoiSang);
                    }
                    soTienNgay += giaSlot;
                }
                const datSan = queryRunner.manager.create(DatSan, {
                    nguoiThue,
                    ngayDat: dayjs(ngayDat).toDate(),
                    ngayThanhToan: new Date(),
                    soTien: soTienNgay,
                });
                await queryRunner.manager.save(datSan);
                allDatSan.push(datSan);
                for (const lich of slots) {
                    const [gioStr, phutStr] = lich.gioBatDau.split(":");
                    const gioBatDau = parseInt(gioStr, 10);
                    const phutBatDau = parseInt(phutStr, 10);
                    const openingMinutes = gioBatDau * 60 + phutBatDau;
                    let eveningThreshold = 17 * 60;
                    if (phutBatDau === 30) eveningThreshold = 17 * 60 + 30;
                    let giaSlot = 0;
                    if (openingMinutes >= eveningThreshold) {
                        giaSlot = Number(sanChiTiet.giaThueBuoiToi);
                    } else {
                        giaSlot = Number(sanChiTiet.giaThueBuoiSang);
                    }
                    const chiTietDatSan = queryRunner.manager.create(ChiTietDatSan, {
                        maDatSan: datSan,
                        maSanChiTiet: sanChiTiet,
                        nguoiThue,
                        maLoaiDat: loaiHinhDat,
                        gioBatDau: lich.gioBatDau,
                        gioKetThuc: lich.gioKetThuc,
                        trangThaiDatSan: "DA_DAT",
                        coVanDe: false,
                        soTien: giaSlot,
                    });
                    await queryRunner.manager.save(chiTietDatSan);
                    allChiTiet.push(chiTietDatSan);
                }
            }
            // Cộng tiền cho chủ sân
            const sanBong = await queryRunner.manager.findOne(SanBongChiTiet, {
                where: { maSanChiTiet },
                relations: ["maSanBong", "maSanBong.chuSan"],
            });
            if (sanBong && sanBong.maSanBong && sanBong.maSanBong.chuSan) {
                sanBong.maSanBong.chuSan.soDuTaiKhoan =
                    Number(sanBong.maSanBong.chuSan.soDuTaiKhoan) + Number(tongTien);
                if (
                    isNaN(sanBong.maSanBong.chuSan.soDuTaiKhoan) ||
                    sanBong.maSanBong.chuSan.soDuTaiKhoan < 0 ||
                    sanBong.maSanBong.chuSan.soDuTaiKhoan > 9999999999
                ) {
                    await queryRunner.rollbackTransaction();
                    return new ServiceResponse(
                        ResponseStatus.Failed,
                        "Số dư chủ sân vượt quá giới hạn",
                        null,
                        400
                    );
                }
                await queryRunner.manager.save(sanBong.maSanBong.chuSan);
            } else {
                await queryRunner.rollbackTransaction();
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Không tìm thấy chủ sân",
                    null,
                    404
                );
            }
            await queryRunner.commitTransaction();
            // Gửi mail cho chủ sân (gom tất cả slot)
            try {
                if (allChiTiet.length > 0) {
                    const chiTietWithRelations = await chiTietDatSanRepo.find({
                        where: { maChiTietDatSan: In(allChiTiet.map(ct => ct.maChiTietDatSan)) },
                        relations: [
                            "maSanChiTiet",
                            "maSanChiTiet.maSanBong",
                            "maSanChiTiet.maSanBong.chuSan",
                            "maDatSan",
                        ],
                    });
                    const firstSlot = chiTietWithRelations[0];
                    const chuSan = firstSlot.maSanChiTiet?.maSanBong?.chuSan;
                    const tenSan = firstSlot.maSanChiTiet?.maSanBong?.tenSan || "";
                    if (chuSan?.email) {
                        const slotList = chiTietWithRelations.map((ct: any) => ({
                            tenSanChiTiet: ct.maSanChiTiet?.tenSanChiTiet,
                            ngayDat: dayjs(ct.maDatSan.ngayDat).format("YYYY-MM-DD"),
                            gioBatDau: ct.gioBatDau,
                            gioKetThuc: ct.gioKetThuc,
                        }));
                        await sendMailNotifyChuSan(
                            chuSan.email,
                            chuSan.hoTen,
                            tenSan,
                            nguoiThue.hoTen,
                            nguoiThue.soDienThoai,
                            slotList
                        );
                    }
                }
            } catch (mailErr) {
                console.error("[DAT SAN] Lỗi gửi mail cho chủ sân (KHÔNG ảnh hưởng kết quả API):", mailErr);
            }
            // Loại bỏ trường matKhau khỏi nguoiThue khi trả về
            const { matKhau, ...nguoiThueResponse } = nguoiThue;
            // Loại bỏ matKhau khỏi từng datSan.nguoiThue
            const allDatSanResponse = allDatSan.map(ds => {
                if (ds.nguoiThue && ds.nguoiThue.matKhau !== undefined) {
                    const { matKhau, ...nguoiThueNoPass } = ds.nguoiThue;
                    return { ...ds, nguoiThue: nguoiThueNoPass };
                }
                return ds;
            });
            return new ServiceResponse(
                ResponseStatus.Success,
                "Đặt sân theo tháng thành công",
                {
                    datSan: allDatSanResponse,
                    chiTietDatSan: allChiTiet,
                    tongTien,
                    tongTienSauGiam,
                    discount,
                    nguoiThue: nguoiThueResponse,
                },
                201
            );
        } catch (err) {
            await queryRunner.rollbackTransaction();
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Có lỗi xảy ra khi đặt sân theo tháng",
                null,
                500
            );
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Lấy các slot đã được đặt của một sân chi tiết trong khoảng thời gian
     * @param maSanChiTiet mã sân chi tiết
     * @param fromDate ngày bắt đầu (ISO string hoặc Date), mặc định là hôm nay
     * @param toDate ngày kết thúc (ISO string hoặc Date), mặc định là 3 tuần sau
     */
    async getBookedSlots(
        maSanChiTiet: string,
        fromDate?: Date,
        toDate?: Date
    ): Promise<ServiceResponse<any>> {
        const start = fromDate ? dayjs(fromDate) : dayjs().startOf("day");
        const end = toDate
            ? dayjs(toDate)
            : dayjs().add(21, "day").endOf("day"); // 3 tuần

        // Lấy các slot đã đặt và chưa bị hủy
        const slots = await chiTietDatSanRepo
            .createQueryBuilder("ct")
            .leftJoinAndSelect("ct.maDatSan", "datSan")
            .where("ct.maSanChiTiet = :maSanChiTiet", { maSanChiTiet })
            .andWhere("datSan.ngayDat BETWEEN :start AND :end", {
                start: start.toDate(),
                end: end.toDate(),
            })
            .andWhere("ct.trangThaiDatSan = :trangThai", {
                trangThai: "DA_DAT",
            })
            .select(["ct.gioBatDau", "ct.gioKetThuc", "datSan.ngayDat"])
            .getMany();

        // Trả về danh sách slot đã đặt
        const result = slots.map((slot) => ({
            ngayDat: dayjs(slot.maDatSan.ngayDat).format("YYYY-MM-DD"),
            gioBatDau: slot.gioBatDau,
            gioKetThuc: slot.gioKetThuc,
        }));

        return new ServiceResponse(
            ResponseStatus.Success,
            "Lấy slot đã đặt thành công",
            result,
            200
        );
    }

    async getLichSuDatSanNguoiThue(
        nguoiThueId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<ServiceResponse<any>> {
        const skip = (page - 1) * limit;

        // Lấy tổng số bản ghi
        const [datSans, total] = await datSanRepo.findAndCount({
            where: { nguoiThue: { maNguoiDung: nguoiThueId } },
            order: { ngayDat: "DESC" },
            relations: ["nguoiThue"],
            skip,
            take: limit,
        });

        const lichSu = [];
        for (const datSan of datSans) {
            // Lấy thêm maSanChiTiet.maSanBong cho từng chi tiết
            const chiTiet = await chiTietDatSanRepo.find({
                where: { maDatSan: Equal(datSan.maDatSan) },
                relations: [
                    "maSanChiTiet",
                    "maSanChiTiet.maSanBong",
                    "maLoaiDat",
                ],
            });

            // Map thêm thông tin sân bóng cha vào từng chi tiết
            const chiTietWithSanBong = chiTiet.map((ct) => {
                const sanBong = ct.maSanChiTiet?.maSanBong;
                return {
                    ...ct,
                    tenSan: sanBong?.tenSan,
                    diaChi: sanBong?.diaChi,
                    quanHuyen: sanBong?.quanHuyen,
                    phuongXa: sanBong?.phuongXa,
                    thanhPho: sanBong?.thanhPho,
                };
            });

            const { nguoiThue, ...datSanRest } = datSan;
            lichSu.push({
                datSan: datSanRest,
                chiTiet: chiTietWithSanBong,
            });
        }

        return new ServiceResponse(
            ResponseStatus.Success,
            "Lấy lịch sử đặt sân thành công",
            {
                total,
                page,
                limit,
                data: lichSu,
            },
            200
        );
    }

    async huyDatSan(
        maDatSan: string,
        nguoiThueId: string
    ): Promise<ServiceResponse<any>> {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        let transactionStarted = false;
        try {
            await queryRunner.startTransaction();
            transactionStarted = true;
            // Lấy thông tin đặt sân
            const datSan = await queryRunner.manager.findOne(DatSan, {
                where: { maDatSan },
                relations: ["nguoiThue"],
            });
            if (!datSan) {
                if (transactionStarted) await queryRunner.rollbackTransaction();
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Không tìm thấy đơn đặt sân",
                    null,
                    404
                );
            }
            if (datSan.nguoiThue?.maNguoiDung !== nguoiThueId) {
                if (transactionStarted) await queryRunner.rollbackTransaction();
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Không có quyền hủy đơn này",
                    null,
                    403
                );
            }

            // Lấy tất cả chi tiết đặt sân
            const chiTietList = await queryRunner.manager.find(ChiTietDatSan, {
                where: { maDatSan: Equal(maDatSan) },
                relations: [
                    "maSanChiTiet",
                    "maSanChiTiet.maSanBong",
                    "maSanChiTiet.maSanBong.chuSan",
                    "maDatSan"
                ],
            });
            if (!chiTietList.length) {
                if (transactionStarted) await queryRunner.rollbackTransaction();
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Không có slot nào để hủy",
                    null,
                    404
                );
            }

            // Kiểm tra điều kiện hủy: tất cả slot phải còn ít nhất 2 tiếng trước giờ đá
            const now = dayjs();
            for (const ct of chiTietList) {
                // Lấy ngày giờ bắt đầu slot
                const ngayDat = dayjs(datSan.ngayDat).format("YYYY-MM-DD");
                const gioBatDau = ct.gioBatDau;
                const slotDateTime = dayjs(
                    `${ngayDat} ${gioBatDau}`,
                    "YYYY-MM-DD HH:mm"
                );
                if (slotDateTime.diff(now, "minute") < 120) {
                    if (transactionStarted) await queryRunner.rollbackTransaction();
                    return new ServiceResponse(
                        ResponseStatus.Failed,
                        `Slot ${ct.gioBatDau} ngày ${ngayDat} không đủ điều kiện hủy (phải hủy trước 2 tiếng).`,
                        null,
                        400
                    );
                }
            }

            // Tính tổng tiền hoàn lại
            const soTienHoanLai = Number(datSan.soTien);

            // Hoàn tiền cho người thuê
            datSan.nguoiThue.soDuTaiKhoan =
                Number(datSan.nguoiThue.soDuTaiKhoan) + soTienHoanLai;
            await queryRunner.manager.save(datSan.nguoiThue);

            // Trừ tiền chủ sân (giả sử tất cả slot cùng 1 chủ sân)
            const chuSan = chiTietList[0].maSanChiTiet?.maSanBong?.chuSan;
            if (chuSan) {
                chuSan.soDuTaiKhoan =
                    Number(chuSan.soDuTaiKhoan) - soTienHoanLai;
                await queryRunner.manager.save(chuSan);
            }

            // Cập nhật trạng thái các slot về "DA_HUY"
            for (const ct of chiTietList) {
                ct.trangThaiDatSan = "DA_HUY";
                await queryRunner.manager.save(ct);
            }

            await queryRunner.commitTransaction();
            transactionStarted = false;

            // Gửi email cho chủ sân thông báo hủy đặt sân (chỉ gửi 1 lần, liệt kê các slot bị hủy)
            try {
                if (chiTietList.length > 0) {
                    const firstSlot = chiTietList[0];
                    const chuSan = firstSlot.maSanChiTiet?.maSanBong?.chuSan;
                    const tenSan = firstSlot.maSanChiTiet?.maSanBong?.tenSan || "";
                    if (chuSan?.email) {
                        // Chuẩn bị danh sách slot bị hủy
                        const slotList = chiTietList.map((ct) => ({
                            tenSanChiTiet: ct.maSanChiTiet?.tenSanChiTiet,
                            ngayDat: dayjs(ct.maDatSan.ngayDat).format("YYYY-MM-DD"),
                            gioBatDau: ct.gioBatDau,
                            gioKetThuc: ct.gioKetThuc,
                        }));
                        await sendMailNotifyChuSan(
                            chuSan.email,
                            chuSan.hoTen,
                            tenSan,
                            datSan.nguoiThue?.hoTen || "",
                            datSan.nguoiThue?.soDienThoai || "",
                            slotList,
                            true // truyền thêm cờ hủy đặt sân
                        );
                    }
                }
            } catch (mailErr) {
                console.error("[HUY DAT SAN] Lỗi gửi mail cho chủ sân (KHÔNG ảnh hưởng kết quả API):", mailErr);
            }

            return new ServiceResponse(
                ResponseStatus.Success,
                "Hủy đặt sân thành công",
                null,
                200
            );
        } catch (err) {
            if (transactionStarted) await queryRunner.rollbackTransaction();
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Có lỗi khi hủy đặt sân",
                null,
                500
            );
        } finally {
            await queryRunner.release();
        }
    }

    async getSlotsByChuSan(
        chuSanId: string,
        trangThaiDatSan?: string,
        ngayDat?: string,
        page: number = 1,
        limit: number = 10,
        search?: string
    ): Promise<ServiceResponse<any>> {
        const skip = (page - 1) * limit;

        const query = chiTietDatSanRepo
            .createQueryBuilder("ct")
            .leftJoinAndSelect("ct.maSanChiTiet", "sanChiTiet")
            .leftJoinAndSelect("sanChiTiet.maSanBong", "sanBong")
            .leftJoinAndSelect("ct.maDatSan", "datSan")
            .leftJoinAndSelect("ct.nguoiThue", "nguoiThue")
            .where("sanBong.chuSan = :chuSanId", { chuSanId });

        if (trangThaiDatSan) {
            query.andWhere("ct.trangThaiDatSan = :trangThaiDatSan", {
                trangThaiDatSan,
            });
        }
        if (ngayDat) {
            query.andWhere("datSan.ngayDat = :ngayDat", { ngayDat });
        }
        if (search) {
            const searchTrim = search.trim().toLowerCase();
            const keywords = searchTrim.split(/\s+/);
            const searchConds: string[] = [];
            const searchParams: Record<string, any> = {};

            keywords.forEach((kw, idx) => {
                searchConds.push(
                    `(LOWER(nguoiThue.hoTen) LIKE :kw${idx} OR LOWER(nguoiThue.soDienThoai) LIKE :kw${idx} OR LOWER(sanChiTiet.tenSanChiTiet) LIKE :kw${idx})`
                );
                searchParams[`kw${idx}`] = `%${kw}%`;
            });

            if (searchConds.length > 0) {
                query.andWhere(searchConds.join(" AND "), searchParams);
            }
        }

        const [slots, total] = await query
            .orderBy("datSan.ngayDat", "DESC")
            .addOrderBy("ct.gioBatDau", "ASC")
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        const data = slots.map((slot) => ({
            ...slot,
            nguoiThue: slot.nguoiThue
                ? {
                      hoTen: slot.nguoiThue.hoTen,
                      soDienThoai: slot.nguoiThue.soDienThoai,
                  }
                : null,
        }));

        return new ServiceResponse(
            ResponseStatus.Success,
            "Lấy danh sách slot theo chủ sân thành công",
            {
                total,
                page,
                limit,
                data,
            },
            200
        );
    }

    async getDashboardReportByChuSan(
        chuSanId: string,
        year: number,
        range: string = "year" // "month" | "quarter" | "year"
    ): Promise<ServiceResponse<any>> {
        // Lấy tất cả sân chi tiết của chủ sân
        const sanChiTietList = await sanBongChiTietRepo
            .createQueryBuilder("sct")
            .leftJoinAndSelect("sct.maSanBong", "sb")
            .where("sb.chuSan = :chuSanId", { chuSanId })
            .getMany();

        const maSanChiTietArr = sanChiTietList.map((s) => s.maSanChiTiet);
        const fieldNameMap = sanChiTietList.reduce((acc, s) => {
            acc[s.maSanChiTiet] = s.tenSanChiTiet;
            return acc;
        }, {} as Record<string, string>);

        // Xác định khoảng thời gian lọc theo range và year
        let fromDate: Date, toDate: Date;
        const now = dayjs();
        if (range === "month") {
            // Nếu truyền year thì lấy tháng hiện tại của năm đó, không thì lấy tháng hiện tại của năm hiện tại
            const base = year ? dayjs().year(year).month(now.month()) : now;
            fromDate = base.startOf("month").toDate();
            toDate = base.endOf("month").toDate();
        } else if (range === "quarter") {
            // Nếu truyền year thì lấy quý hiện tại của năm đó, không thì lấy quý hiện tại của năm hiện tại
            const base = year ? dayjs().year(year).month(now.month()) : now;
            fromDate = base.startOf("quarter").toDate();
            toDate = base.endOf("quarter").toDate();
        } else {
            // range === "year"
            fromDate = dayjs().year(year).startOf("year").toDate();
            toDate = dayjs().year(year).endOf("year").toDate();
        }

        // Lấy tất cả slot đã đặt trong khoảng thời gian
        const slots = await chiTietDatSanRepo
            .createQueryBuilder("ct")
            .leftJoinAndSelect("ct.maDatSan", "ds")
            .leftJoinAndSelect("ct.maSanChiTiet", "sct")
            .where("ct.maSanChiTiet IN (:...maSanChiTietArr)", {
                maSanChiTietArr,
            })
            .andWhere("ds.ngayDat BETWEEN :fromDate AND :toDate", {
                fromDate,
                toDate,
            })
            // .andWhere("ct.trangThaiDatSan IN (:...trangThai)", {
            //     trangThai: ["DA_DAT", "DA_HOAN_THANH"],
            // })
            .andWhere("ct.trangThaiDatSan = :trangThai", {
                trangThai: "DA_HOAN_THANH",
            })
            .getMany();

        // Doanh thu và lượt đặt theo tháng (hoặc theo ngày nếu range=month)
        let revenueByMonth: Array<{ month: string; revenue: number }> = [];
        let bookingCountByMonth: Array<{ month: string; bookings: number }> =
            [];

        if (range === "month") {
            // Thống kê theo từng ngày trong tháng
            const daysInMonth = now.daysInMonth();
            const revenueDayMap: Record<number, number> = {};
            const bookingDayMap: Record<number, number> = {};
            for (let d = 1; d <= daysInMonth; d++) {
                revenueDayMap[d] = 0;
                bookingDayMap[d] = 0;
            }
            for (const slot of slots) {
                const day = dayjs(slot.maDatSan.ngayDat).date();
                revenueDayMap[day] += Number(slot.soTien);
                bookingDayMap[day] += 1;
            }
            for (let d = 1; d <= daysInMonth; d++) {
                revenueByMonth.push({
                    month: `Ngày ${d}`,
                    revenue: revenueDayMap[d],
                });
                bookingCountByMonth.push({
                    month: `Ngày ${d}`,
                    bookings: bookingDayMap[d],
                });
            }
        } else if (range === "quarter") {
            // Thống kê theo từng tháng trong quý
            const startMonth = now.startOf("quarter").month() + 1;
            const revenueQuarterMap: Record<number, number> = {};
            const bookingQuarterMap: Record<number, number> = {};
            for (let m = startMonth; m < startMonth + 3; m++) {
                revenueQuarterMap[m] = 0;
                bookingQuarterMap[m] = 0;
            }
            for (const slot of slots) {
                const month = (slot.maDatSan.ngayDat.getMonth() || 0) + 1;
                if (month >= startMonth && month < startMonth + 3) {
                    revenueQuarterMap[month] += Number(slot.soTien);
                    bookingQuarterMap[month] += 1;
                }
            }
            for (let m = startMonth; m < startMonth + 3; m++) {
                revenueByMonth.push({
                    month: `T${m}`,
                    revenue: revenueQuarterMap[m],
                });
                bookingCountByMonth.push({
                    month: `T${m}`,
                    bookings: bookingQuarterMap[m],
                });
            }
        } else {
            // Thống kê theo từng tháng trong năm
            const revenueMonthMap: Record<number, number> = {};
            const bookingMonthMap: Record<number, number> = {};
            for (let m = 1; m <= 12; m++) {
                revenueMonthMap[m] = 0;
                bookingMonthMap[m] = 0;
            }
            for (const slot of slots) {
                const month = (slot.maDatSan.ngayDat.getMonth() || 0) + 1;
                revenueMonthMap[month] += Number(slot.soTien);
                bookingMonthMap[month] += 1;
            }
            for (let m = 1; m <= 12; m++) {
                revenueByMonth.push({
                    month: `T${m}`,
                    revenue: revenueMonthMap[m],
                });
                bookingCountByMonth.push({
                    month: `T${m}`,
                    bookings: bookingMonthMap[m],
                });
            }
        }

        // Tổng doanh thu, tổng lượt đặt
        const totalRevenue = slots.reduce(
            (sum, s) => sum + Number(s.soTien),
            0
        );
        const totalBookings = slots.length;

        // Tỷ lệ sử dụng từng sân chi tiết (usage = số slot đã đặt / tổng số ngày * số ca/ngày)
        // Nếu chưa có cấu hình ca/ngày, chỉ lấy usage = số slot đã đặt trong năm
        const fieldUsageMap: Record<string, number> = {};
        for (const sct of sanChiTietList) {
            fieldUsageMap[sct.maSanChiTiet] = 0;
        }
        for (const slot of slots) {
            fieldUsageMap[slot.maSanChiTiet.maSanChiTiet] += 1;
        }
        const fieldUsage: Array<{ field: string; usage: number }> =
            Object.entries(fieldUsageMap).map(([maSanChiTiet, count]) => ({
                field: fieldNameMap[maSanChiTiet] || maSanChiTiet,
                usage: count, // FE sẽ tự tính phần trăm nếu muốn
            }));

        // Tỷ lệ sử dụng trung bình (trên tổng số slot đã đặt của tất cả sân chi tiết)
        const averageUsage =
            fieldUsage.length > 0
                ? Number(
                      (
                          fieldUsage.reduce((sum, f) => sum + f.usage, 0) /
                          fieldUsage.length
                      ).toFixed(2)
                  )
                : 0;

        // Khách hàng mới, % tăng trưởng: để sau nếu cần

        // Dummy các trường thay đổi % và khách hàng mới
        const newCustomers = 0;
        const revenueChangePercent = 0;
        const bookingChangePercent = 0;
        const usageChangePercent = 0;
        const newCustomersChangePercent = 0;

        // Map lại các trường sang tiếng Việt
        const doanhThuTheoThang = revenueByMonth.map((item) => ({
            thang: item.month,
            doanhThu: item.revenue,
        }));
        const luotDatTheoThang = bookingCountByMonth.map((item) => ({
            thang: item.month,
            luotDat: item.bookings,
        }));
        const tiLeSuDungSan = fieldUsage.map((item) => ({
            san: item.field,
            tiLeSuDung: item.usage,
        }));

        const result = {
            doanhThuTheoThang,
            luotDatTheoThang,
            tiLeSuDungSan,
            tongDoanhThu: totalRevenue,
            tongLuotDat: totalBookings,
            tiLeSuDungTrungBinh: averageUsage,
            khachHangMoi: newCustomers,
            phanTramTangTruongDoanhThu: revenueChangePercent,
            phanTramTangTruongLuotDat: bookingChangePercent,
            phanTramTangTruongSuDung: usageChangePercent,
            phanTramTangTruongKhachHangMoi: newCustomersChangePercent,
        };

        return new ServiceResponse(
            ResponseStatus.Success,
            "Lấy dữ liệu dashboard thành công",
            result,
            200
        );
    }

    // ADMIN: Lấy tất cả slot của tất cả sân bóng
    async getAllSlotsForAdmin(
        page: number = 1,
        limit: number = 10,
        trangThaiDatSan?: string,
        search?: string,
        ngayDat?: string
    ): Promise<ServiceResponse<any>> {
        const skip = (page - 1) * limit;
        const query = chiTietDatSanRepo
            .createQueryBuilder("ct")
            .leftJoinAndSelect("ct.maSanChiTiet", "sanChiTiet")
            .leftJoinAndSelect("sanChiTiet.maSanBong", "sanBong")
            .leftJoinAndSelect("ct.maDatSan", "datSan")
            .leftJoinAndSelect("ct.nguoiThue", "nguoiThue");

        if (trangThaiDatSan) {
            query.andWhere("ct.trangThaiDatSan = :trangThaiDatSan", {
                trangThaiDatSan,
            });
        }
        if (ngayDat) {
            query.andWhere("datSan.ngayDat = :ngayDat", { ngayDat });
        }
        if (search) {
            const searchTrim = search.trim().toLowerCase();
            const keywords = searchTrim.split(/\s+/);
            const searchConds: string[] = [];
            const searchParams: Record<string, any> = {};
            keywords.forEach((kw, idx) => {
                searchConds.push(
                    `(LOWER(nguoiThue.hoTen) LIKE :kw${idx} OR LOWER(nguoiThue.soDienThoai) LIKE :kw${idx} OR LOWER(sanChiTiet.tenSanChiTiet) LIKE :kw${idx} OR LOWER(sanBong.tenSan) LIKE :kw${idx})`
                );
                searchParams[`kw${idx}`] = `%${kw}%`;
            });
            if (searchConds.length > 0) {
                query.andWhere(searchConds.join(" AND "), searchParams);
            }
        }

        const [slots, total] = await query
            .orderBy("datSan.ngayDat", "DESC")
            .addOrderBy("ct.gioBatDau", "ASC")
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        return new ServiceResponse(
            ResponseStatus.Success,
            "Lấy danh sách slot thành công",
            {
                total,
                page,
                limit,
                data: slots,
            },
            200
        );
    }

    // ADMIN: Chuyển cờ coVanDe
    async setCoVanDeForSlot(
        maChiTietDatSan: string,
        coVanDe: boolean
    ): Promise<ServiceResponse<any>> {
        const slot = await chiTietDatSanRepo.findOne({
            where: { maChiTietDatSan },
        });
        if (!slot) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy slot",
                null,
                404
            );
        }
        slot.coVanDe = coVanDe;

        if (coVanDe) {
            slot.trangThaiDatSan = "CO_VAN_DE";
        } else {
            // Nếu giải quyết xong vấn đề, trả lại trạng thái DA_DAT để cron xử lý tiếp
            slot.trangThaiDatSan = "DA_DAT";
        }

        await chiTietDatSanRepo.save(slot);
        return new ServiceResponse(
            ResponseStatus.Success,
            "Cập nhật cờ coVanDe thành công",
            slot,
            200
        );
    }
}

export const datSanService = new DatSanService();
