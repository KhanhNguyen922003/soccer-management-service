/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

export interface MediaDTO {
    ten: string;
    link: string;
    loaiMedia: string;
    mediaId: string;
}

export interface CreateSanBongDTO {
    tenSan: string;
    moTa: string;
    diaChi: string;
    quanHuyen: string;
    phuongXa: string;
    thanhPho: string;
    gioMoCua: string;
    gioDongCua: string;
    media: MediaDTO[];
}