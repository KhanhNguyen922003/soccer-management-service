/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

export interface SignUpDTO {
    hoTen: string;
    email: string;
    soDienThoai: string;
    vaiTro: 'nguoiThue' | 'chuSan';
}