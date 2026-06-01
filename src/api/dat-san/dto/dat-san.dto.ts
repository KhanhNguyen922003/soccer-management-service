/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

export interface LichDatDTO {
    ngayDat: string;      // yyyy-MM-dd
    gioBatDau: string;    // HH:mm
    gioKetThuc: string;   // HH:mm
}

export interface DatSanInputDTO {
    nguoiThueId: string;
    maSanChiTiet: string;
    maLoaiDat: string;
    soTien: number;
    lichDat: LichDatDTO[];
}
