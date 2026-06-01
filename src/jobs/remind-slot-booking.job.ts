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
import { sendMailRemindBooking } from "@/utils/sendMail.util";
import dayjs from "dayjs";

export async function remindSlotBookingJob() {
    const chiTietDatSanRepo = AppDataSource.getRepository(ChiTietDatSan);

    const now = dayjs();

    // Lấy các slot DA_DAT, chưa gửi thông báo, bắt đầu trong vòng 1 tiếng tới
    const slots = await chiTietDatSanRepo
        .createQueryBuilder("ct")
        .leftJoinAndSelect("ct.maSanChiTiet", "sanChiTiet")
        .leftJoinAndSelect("sanChiTiet.maSanBong", "sanBong")
        .leftJoinAndSelect("ct.nguoiThue", "nguoiThue")
        .where("ct.trangThaiDatSan = :trangThai", { trangThai: "DA_DAT" })
        .andWhere("ct.daGuiThongBao = false")
        .getMany();

    let count = 0;
    for (const slot of slots) {
        // Tính thời gian bắt đầu slot
        const ngayDat = dayjs(slot.maDatSan?.ngayDat || slot.createdAt).format(
            "YYYY-MM-DD"
        );
        const gioBatDau = slot.gioBatDau;
        const slotStart = dayjs(`${ngayDat} ${gioBatDau}`, "YYYY-MM-DD HH:mm");

        // Nếu slotStart cách now từ 0 đến 60 phút thì gửi mail
        const diffMinutes = slotStart.diff(now, "minute");
        if (diffMinutes >= 60 || diffMinutes < 0) continue;

        // Gửi mail
        if (
            slot.nguoiThue?.email &&
            slot.maSanChiTiet &&
            slot.maSanChiTiet.maSanBong
        ) {
            await sendMailRemindBooking(
                slot.nguoiThue.email,
                slot.nguoiThue.hoTen,
                slot.maSanChiTiet.maSanBong.tenSan,
                slot.maSanChiTiet.tenSanChiTiet,
                slot.gioBatDau,
                slot.maSanChiTiet.maSanBong.diaChi,
                ngayDat
            );
            // Đánh dấu đã gửi thông báo
            slot.daGuiThongBao = true;
            await chiTietDatSanRepo.save(slot);
            count++;
        }
    }
    if (count > 0) {
        console.log(
            `[remind-slot-booking.job] Đã gửi ${count} mail nhắc lịch đặt sân trước 1 giờ.`
        );
    }
}
