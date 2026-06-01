/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

/**
 * Enum để chỉ trạng thái của phản hồi.
 * - Success: Thành công.
 * - Failed: Thất bại.
 */

export enum ResponseStatus {
    Success,
    Failed,
}

/**
 * Lớp để đóng gói phản hồi từ Service.
 * Bao gồm trạng thái, thông điệp, dữ liệu và mã HTTP.
 * 
 * @template T - Kiểu dữ liệu trả về (mặc định là null nếu không có dữ liệu).
 */

export class ServiceResponse<T = null> {
    status: ResponseStatus;
    success: boolean;
    message: string;
    data: T;
    code: number;

    /**
     * Tạo một phản hồi mới từ service.
     * 
     * @param status - Trạng thái (Success hoặc Failed)
     * @param message - Thông điệp chi tiết
     * @param data - Dữ liệu trả về
     * @param code - Mã trạng thái HTTP
     */
    
    constructor(status: ResponseStatus, message: string, data: T, code: number) {
        this.status = status;
        this.success = status === ResponseStatus.Success;
        this.message = message;
        this.data = data;
        this.code = code;
    }
}