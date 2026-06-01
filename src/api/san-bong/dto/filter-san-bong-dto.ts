/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */
export interface SanBongFilterDTO {
    search?: string;
    tenSan?: string;
    quanHuyen?: string;
    phuongXa?: string;
    diaChi?: string;
    viDo?: number; // Vĩ độ
    kinhDo?: number; // Kinh độ
    page?: number;
    limit?: number;
}