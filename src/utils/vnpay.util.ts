/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import crypto from "crypto";
import querystring from "qs";
import moment from "moment";
import { Request } from "express";

interface VnpParams {
    [key: string]: string | number;
}

const sortObject = (obj: VnpParams): VnpParams => {
    const sorted: VnpParams = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
        // ensure value is string and URL-encoded in VNPay-friendly way
        sorted[key] = encodeURIComponent(obj[key].toString()).replace(/%20/g, "+");
    }
    return sorted;
};

const createVnpayUrl = (
    orderInfo: string,
    amount: number,
    req: Request
): string => {
    const createDate = moment().format("YYYYMMDDHHmmss");

    const vnp_TmnCode = process.env.vnp_TmnCode as string;
    const vnp_HashSecret = process.env.vnp_HashSecret as string;
    const vnp_Url = process.env.vnp_Url as string;
    const vnp_ReturnUrl = process.env.vnp_ReturnUrl as string;

    // Validate required env vars early to provide clearer errors
    if (!vnp_TmnCode || !vnp_HashSecret || !vnp_Url || !vnp_ReturnUrl) {
        throw new Error(
            'VNPay config missing. Ensure vnp_TmnCode, vnp_HashSecret, vnp_Url and vnp_ReturnUrl are set.'
        );
    }

    const vnp_TxnRef = Date.now().toString(); // mã giao dịch duy nhất
    const vnp_Amount = amount * 100; // chuyển sang đơn vị đồng
    const vnp_IpAddr =
        (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";

    // Normalize IP (avoid IPv6 mapped IPv4 like ::ffff:127.0.0.1)
    let clientIp = vnp_IpAddr || "";
    if (clientIp.startsWith("::ffff:")) clientIp = clientIp.replace("::ffff:", "");
    if (clientIp === "::1") clientIp = "127.0.0.1";

    let vnp_Params: VnpParams = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode,
        vnp_Locale: "vn",
        vnp_CurrCode: "VND",
        vnp_TxnRef,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: "billpayment",
        vnp_Amount: vnp_Amount,
        vnp_ReturnUrl,
        vnp_IpAddr: clientIp,
        vnp_CreateDate: createDate,
    };

    // Remove undefined/null/empty-string params before signing
    Object.keys(vnp_Params).forEach((k) => {
        const v = vnp_Params[k];
        if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) {
            delete vnp_Params[k];
        }
    });

    vnp_Params = sortObject(vnp_Params);
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    // Debug logs in development to help diagnose "incorrect format" errors
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[vnpay] signData =>', signData);
        // eslint-disable-next-line no-console
        console.log('[vnpay] secureHash =>', signed);
        // eslint-disable-next-line no-console
        console.log('[vnpay] fullUrl =>', vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false }));
    }

    return vnp_Url + "?" + querystring.stringify(vnp_Params, { encode: false });
};

const verifyVnpayReturnUrl = (query: Record<string, any>): boolean => {
    const vnp_HashSecret = process.env.vnp_HashSecret as string;

    const vnp_Params = { ...query };
    const secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    // Remove empty values that may appear in callback
    Object.keys(vnp_Params).forEach((k) => {
        const v = vnp_Params[k];
        if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) {
            delete vnp_Params[k];
        }
    });

    const sortedParams = sortObject(vnp_Params);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[vnpay] verify signData =>', signData);
        // eslint-disable-next-line no-console
        console.log('[vnpay] incoming secureHash =>', secureHash);
        // eslint-disable-next-line no-console
        console.log('[vnpay] calc secureHash =>', signed);
    }

    return secureHash === signed;
};

export { createVnpayUrl, verifyVnpayReturnUrl, sortObject };
