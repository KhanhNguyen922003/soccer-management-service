/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { VaiTro } from "@/models/enums/vaiTro.enum";

export interface GoogleSignInDTO {
    accessToken: string;
    user: {
        email: string;
        name?: string;
        picture?: string;
        sub?: string;
    };
    vaiTro: VaiTro;
}