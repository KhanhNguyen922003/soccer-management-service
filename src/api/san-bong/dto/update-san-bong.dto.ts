/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { MediaDTO } from "./create-san-bong.dto";

export interface UpdateSanBongDTO {
    tenSan?: string;
    moTa?: string;
    diaChi?: string;
    quanHuyen?: string;
    phuongXa?: string;
    thanhPho?: string;
    gioMoCua?: string;
    gioDongCua?: string;
    media?: MediaDTO[];
    mediaIdToRemove?: string[];
}