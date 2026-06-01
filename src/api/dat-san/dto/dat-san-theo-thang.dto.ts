/*
 * DTO for long-term (monthly) pitch booking
 */

export interface DatSanTheoThangInputDTO {
    nguoiThueId: string;
    maSanChiTiet: string;
    maLoaiDat: string;
    ngayBatDau: string; // yyyy-MM-dd
    ngayKetThuc: string; // yyyy-MM-dd
    gioBatDau: string; // HH:mm
    gioKetThuc: string; // HH:mm
    thuTrongTuan: number[]; // [1-0] (Monday-Sunday)
    soTien?: number; // optional, calculated on BE
    ghiChu?: string;
}
