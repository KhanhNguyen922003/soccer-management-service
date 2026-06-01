/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

/**
 * Xử lý và trả về phản hồi HTTP từ ServiceResponse.
 * 
 * Dùng thông tin từ ServiceResponse (mã trạng thái, thông điệp, dữ liệu)
 * để gửi một HTTP response về client.
 * 
 * @param serviceResponse - Đối tượng chứa mã trạng thái, thông điệp và dữ liệu.
 * @param response - Đối tượng `Response` của Express để gửi phản hồi.
 * 
 * @returns Trả về một HTTP response với mã trạng thái và dữ liệu từ serviceResponse.
 */

import { Response } from "express";
import { ServiceResponse } from "./serviceResponse";

// Hàm xử lý trả về response từ ServiceResponse
export const handleServiceResponse = (
    serviceResponse: ServiceResponse<any>,
    response: Response
) => {
    // Gửi HTTP response với mã trạng thái, thông điệp và dữ liệu từ serviceResponse
    return response.status(serviceResponse.code).send({
        message: serviceResponse.message,
        data: serviceResponse.data,
    });
};