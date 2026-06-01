/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { PaymentService } from "./payment.service";
import { handleServiceResponse } from "@/services/httpHandlerResponse";
import { ResponseStatus } from "@/services/serviceResponse";

const paymentService = new PaymentService();

export const PaymentController = {
    async deposit(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const { amount } = req.body;
        const userId = req.user?.maNguoiDung;
        if (!userId) {
            return res.status(401).json({ message: "Chưa đăng nhập" });
        }
        const response = await paymentService.deposit(userId, amount, req);
        return handleServiceResponse(response, res);
    },

    async vnpayReturn(req: Request, res: Response): Promise<Response | void> {
        const response = await paymentService.handleVnpayReturn(req.query);

        // Xác định redirect URL FE (có thể truyền thêm query string nếu muốn)
        const feReturnUrl = process.env.FE_PAYMENT_RETURN_URL;
        console.log("-------------------", feReturnUrl);
        
        const success = response.status === ResponseStatus.Success;
        const amount = req.query.vnp_Amount
            ? Number(req.query.vnp_Amount) / 100
            : 0;

        // Redirect về FE, truyền trạng thái và số tiền nạp (nếu muốn)
        return res.redirect(
            `${feReturnUrl}?success=${success}&amount=${amount}`
        );
    },
};
