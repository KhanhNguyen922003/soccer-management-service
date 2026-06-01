/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Request } from "express";
import { createVnpayUrl, verifyVnpayReturnUrl } from "../../utils/vnpay.util";
import AppDataSource from "@/config/typeorm.config";
import { NguoiDung } from "@/models/entities/nguoi-dung.entity";
import { NapTien } from "@/models/entities/nap-tien.entity";
import { ResponseStatus, ServiceResponse } from "@/services/serviceResponse";

const nguoiDungRepo = AppDataSource.getRepository(NguoiDung);
const napTienRepo = AppDataSource.getRepository(NapTien);

export class PaymentService {
    async deposit(userId: string, amount: number, req: Request) {
        if (!amount || amount <= 0) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Số tiền không hợp lệ",
                null,
                400
            );
        }
        if (!userId) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Chưa đăng nhập",
                null,
                401
            );
        }
        const orderInfo = `Nap tien cho nguoi dung ${userId}`;
        const url = createVnpayUrl(orderInfo, amount, req);
        return new ServiceResponse(
            ResponseStatus.Success,
            "Tạo url VNPay thành công",
            { url },
            200
        );
    }

    async handleVnpayReturn(query: Record<string, any>) {
        const isValid = verifyVnpayReturnUrl(query);
        if (!isValid) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Chữ ký không hợp lệ",
                null,
                400
            );
        }
        const vnp_Amount = Number(query.vnp_Amount) / 100;
        const vnp_OrderInfo = query.vnp_OrderInfo as string;
        const match = vnp_OrderInfo.match(/nguoi dung (\S+)/);
        const userId = match ? match[1] : null;
        if (!userId) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy người dùng",
                null,
                400
            );
        }
        if (query.vnp_ResponseCode !== "00") {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Giao dịch không thành công",
                null,
                400
            );
        }
        const user = await nguoiDungRepo.findOne({
            where: { maNguoiDung: userId },
        });
        if (!user) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy người dùng",
                null,
                404
            );
        }

        // Ghi nhận lịch sử nạp tiền
        const napTien = napTienRepo.create({
            nguoiNap: user,
            soTien: vnp_Amount,
            thoiGianNap: new Date(),
            maGiaoDich: query.vnp_TxnRef,
            trangThai: "success",
        });
        await napTienRepo.save(napTien);

        // Cộng tiền vào tài khoản
        user.soDuTaiKhoan = Number(user.soDuTaiKhoan) + vnp_Amount;
        await nguoiDungRepo.save(user);

        console.log("soDuMoi", Number(user.soDuTaiKhoan));
        
        // Trả về số dư mới
        return new ServiceResponse(
            ResponseStatus.Success,
            "Nạp tiền thành công",
            { soDuMoi: Number(user.soDuTaiKhoan) },
            200
        );
    }
}
