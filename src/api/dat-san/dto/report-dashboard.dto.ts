export interface ReportDashboardData {
    doanhThuTheoThang: Array<{ thang: string; doanhThu: number }>;
    luotDatTheoThang: Array<{ thang: string; luotDat: number }>;
    tiLeSuDungSan: Array<{ san: string; tiLeSuDung: number }>;
    tongDoanhThu: number;
    tongLuotDat: number;
    tiLeSuDungTrungBinh: number;
    khachHangMoi: number;
    phanTramTangTruongDoanhThu: number;
    phanTramTangTruongLuotDat: number;
    phanTramTangTruongSuDung: number;
    phanTramTangTruongKhachHangMoi: number;
}
