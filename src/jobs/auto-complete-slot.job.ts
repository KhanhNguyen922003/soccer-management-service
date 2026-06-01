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
import dayjs from "dayjs";

export async function autoCompleteSlotJob() {
    const chiTietDatSanRepo = AppDataSource.getRepository(ChiTietDatSan);

    // Lấy tất cả slot còn trạng thái DA_DAT và đã qua giờ kết thúc
    const now = dayjs();
    // const slots = await chiTietDatSanRepo
    //     .createQueryBuilder("ct")
    //     .leftJoinAndSelect("ct.maDatSan", "datSan")
    //     .where("ct.trangThaiDatSan = :trangThai", { trangThai: "DA_DAT" })
    //     .getMany();
    const slots = await chiTietDatSanRepo
        .createQueryBuilder("ct")
        .leftJoinAndSelect("ct.maDatSan", "datSan")
        .where("ct.trangThaiDatSan = :trangThai", { trangThai: "DA_DAT" })
        .andWhere("ct.coVanDe = false")
        .getMany();

    let count = 0;
    for (const slot of slots) {
        // Lấy ngày đặt và giờ kết thúc
        const ngayDat = dayjs(slot.maDatSan.ngayDat).format("YYYY-MM-DD");
        const gioKetThuc = slot.gioKetThuc;
        const slotEnd = dayjs(`${ngayDat} ${gioKetThuc}`, "YYYY-MM-DD HH:mm");
        if (slotEnd.isBefore(now)) {
            slot.trangThaiDatSan = "DA_HOAN_THANH";
            await chiTietDatSanRepo.save(slot);
            count++;
        }
    }
    if (count > 0) {
        console.log(`[auto-complete-slot.job] Đã cập nhật ${count} slot sang DA_HOAN_THANH`);
    }
}
