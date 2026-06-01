/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler.util";

const paymentRouter = Router();

paymentRouter.post(
    "/create-payment-url",
    authenticateToken,
    asyncHandler(PaymentController.deposit)
);
paymentRouter.get("/vnpay-return", asyncHandler(PaymentController.vnpayReturn));

export default paymentRouter;