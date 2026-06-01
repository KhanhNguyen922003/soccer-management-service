/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { VaiTro } from "@/models/enums/vaiTro.enum";

export interface DecodedToken {
    maNguoiDung: string;
    vaiTro: VaiTro;
    iat?: number;
    exp?: number;
}