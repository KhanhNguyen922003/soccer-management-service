/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */
import AppDataSource from "@/config/typeorm.config";
import { SanBong } from "@/models/entities/san-bong.entity";
import { UpdateSanBongDTO } from "./dto/update-san-bong.dto";
import { ResponseStatus, ServiceResponse } from "@/services/serviceResponse";
import { MediaSanBong } from "@/models/entities/media-san-bong.entity";
import { NguoiDung } from "@/models/entities/nguoi-dung.entity";
import { CreateSanBongDTO } from "./dto/create-san-bong.dto";
import { SanBongFilterDTO } from "./dto/filter-san-bong-dto";
import { DanhGia } from "@/models/entities/danh-gia.entity";
import { SanBongChiTiet } from "@/models/entities/san-bong-chi-tiet.entity";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getCoordinatesFromAddress } from "@/utils/geocoding.util";
import { In } from "typeorm";

const sanBongRepo = AppDataSource.getRepository(SanBong);
const mediaRepo = AppDataSource.getRepository(MediaSanBong);
const nguoiDungRepo = AppDataSource.getRepository(NguoiDung);
const danhGiaRepo = AppDataSource.getRepository(DanhGia);
const sanBongChiTietRepo = AppDataSource.getRepository(SanBongChiTiet);
dayjs.extend(customParseFormat);

interface FinalSanBong {
  media: {
    ten: string;
    link: string;
    loaiMedia: string;
    mediaId: string;
  }[];
  maSanBong: string;
  tenSan: string;
  diaChi: string;
  quanHuyen: string;
  phuongXa: string;
  thanhPho: string;
  moTa: string;
  hinhAnh?: string;
  daDuyet: boolean;
  gioMoCua: string;
  gioDongCua: string;
  createdAt: Date;
  updatedAt: Date;
  viDo: number;
  kinhDo: number;
}

export class SanBongService {
  async getSanBongByChuSan(
    chuSanId: string,
  ): Promise<ServiceResponse<FinalSanBong | null>> {
    const sanBong = await sanBongRepo.findOne({
      where: {
        chuSan: { maNguoiDung: chuSanId },
      },
      relations: ["media"],
    });

    if (!sanBong) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Chưa có sân bóng nào",
        null,
        404,
      );
    }

    const formattedMedia = sanBong.media.map(
      ({ ten, link, loaiMedia, mediaId }) => ({
        ten,
        link,
        loaiMedia,
        mediaId,
      }),
    );

    const finalSanBong: FinalSanBong = {
      maSanBong: sanBong.maSanBong,
      tenSan: sanBong.tenSan,
      diaChi: sanBong.diaChi,
      quanHuyen: sanBong.quanHuyen,
      phuongXa: sanBong.phuongXa,
      thanhPho: sanBong.thanhPho,
      moTa: sanBong.moTa,
      hinhAnh: sanBong.hinhAnh,
      daDuyet: sanBong.daDuyet,
      gioMoCua: dayjs(sanBong.gioMoCua, "HH:mm:ss").isValid()
        ? dayjs(sanBong.gioMoCua, "HH:mm:ss").format("HH:mm")
        : "",
      gioDongCua: dayjs(sanBong.gioDongCua, "HH:mm:ss").isValid()
        ? dayjs(sanBong.gioDongCua, "HH:mm:ss").format("HH:mm")
        : "",
      createdAt: sanBong.createdAt,
      updatedAt: sanBong.updatedAt,
      viDo: sanBong.viDo,
      kinhDo: sanBong.kinhDo,
      media: formattedMedia,
    };

    return new ServiceResponse(
      ResponseStatus.Success,
      "Lấy thông tin sân bóng thành công",
      finalSanBong,
      200,
    );
  }

  async createSanBong(
    chuSanId: string,
    data: CreateSanBongDTO,
  ): Promise<ServiceResponse<FinalSanBong | null>> {
    const chuSan = await nguoiDungRepo.findOne({
      where: { maNguoiDung: chuSanId },
    });

    if (!chuSan) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Không tìm thấy người dùng",
        null,
        404,
      );
    }

    const thanhPho = data.thanhPho || "Đà Nẵng";

    // Ghép địa chỉ đầy đủ từ các trường
    // const fullAddress = `${data.diaChi}, ${data.phuongXa}, ${data.quanHuyen}, ${thanhPho}`;
    const fullAddress = `${data.diaChi}, ${thanhPho}`;
    const coordinates = await getCoordinatesFromAddress(fullAddress);

    console.log("Full address:", fullAddress);
    console.log("Coordinates fetched:", coordinates);

    if (!coordinates) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Không thể lấy tọa độ từ địa chỉ. Vui lòng kiểm tra lại.",
        null,
        400,
      );
    }
    const { media, ...sanBongData } = data;

    // Tạo sân bóng với kinh độ và vĩ độ
    const sanBong = sanBongRepo.create({
      ...sanBongData,
      thanhPho,
      chuSan,
      daDuyet: false,
      viDo: coordinates.viDo,
      kinhDo: coordinates.kinhDo,
    });

    await sanBongRepo.save(sanBong);

    const mediaEntities = data.media.map((m) =>
      mediaRepo.create({
        ten: m.ten,
        link: m.link,
        loaiMedia: m.loaiMedia,
        mediaId: m.mediaId,
        sanBong,
      }),
    );
    await mediaRepo.save(mediaEntities);

    const formattedMedia = mediaEntities.map(
      ({ ten, link, loaiMedia, mediaId }) => ({
        ten,
        link,
        loaiMedia,
        mediaId,
      }),
    );

    const finalSanBong: FinalSanBong = {
      maSanBong: sanBong.maSanBong,
      tenSan: sanBong.tenSan,
      diaChi: sanBong.diaChi,
      quanHuyen: sanBong.quanHuyen,
      phuongXa: sanBong.phuongXa,
      thanhPho: sanBong.thanhPho,
      moTa: sanBong.moTa,
      hinhAnh: sanBong.hinhAnh,
      daDuyet: sanBong.daDuyet,
      gioMoCua: dayjs(sanBong.gioMoCua, "HH:mm:ss").isValid()
        ? dayjs(sanBong.gioMoCua, "HH:mm:ss").format("HH:mm")
        : "",
      gioDongCua: dayjs(sanBong.gioDongCua, "HH:mm:ss").isValid()
        ? dayjs(sanBong.gioDongCua, "HH:mm:ss").format("HH:mm")
        : "",
      createdAt: sanBong.createdAt,
      updatedAt: sanBong.updatedAt,
      viDo: sanBong.viDo,
      kinhDo: sanBong.kinhDo,
      media: formattedMedia,
    };

    return new ServiceResponse(
      ResponseStatus.Success,
      "Tạo sân bóng thành công",
      finalSanBong,
      201,
    );
  }

  async updateSanBong(
    chuSanId: string,
    data: UpdateSanBongDTO,
  ): Promise<ServiceResponse<FinalSanBong | null>> {
    const sanBong = await sanBongRepo.findOne({
      where: { chuSan: { maNguoiDung: chuSanId } },
      relations: ["media"],
    });

    if (!sanBong) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Không tìm thấy sân bóng",
        null,
        404,
      );
    }

    if (data.tenSan !== undefined) sanBong.tenSan = data.tenSan;
    if (data.moTa !== undefined) sanBong.moTa = data.moTa;
    if (data.diaChi !== undefined) sanBong.diaChi = data.diaChi;
    if (data.quanHuyen !== undefined) sanBong.quanHuyen = data.quanHuyen;
    if (data.phuongXa !== undefined) sanBong.phuongXa = data.phuongXa;
    if (data.thanhPho !== undefined)
      sanBong.thanhPho = data.thanhPho || "Đà Nẵng";
    if (data.gioMoCua !== undefined) sanBong.gioMoCua = data.gioMoCua;
    if (data.gioDongCua !== undefined) sanBong.gioDongCua = data.gioDongCua;

    await sanBongRepo.save(sanBong);

    // Xử lý cập nhật media (thêm / xoá theo mediaId)
    if (data.media || data.mediaIdToRemove) {
      // Xoá media theo mediaId FE gửi lên
      if (data.mediaIdToRemove && data.mediaIdToRemove.length > 0) {
        await mediaRepo.delete({ mediaId: In(data.mediaIdToRemove) });
      }

      // Thêm media mới
      if (data.media && data.media.length > 0) {
        const newMediaEntities = data.media.map((m) =>
          mediaRepo.create({ ...m, sanBong }),
        );
        await mediaRepo.save(newMediaEntities);
      }

      // Lấy lại media mới nhất để trả về
      const updatedMedia = await mediaRepo.find({
        where: { sanBong: { maSanBong: sanBong.maSanBong } },
        order: { createdAt: "ASC" },
      });

      sanBong.media = updatedMedia;
    }

    const finalSanBong: FinalSanBong = {
      maSanBong: sanBong.maSanBong,
      tenSan: sanBong.tenSan,
      diaChi: sanBong.diaChi,
      quanHuyen: sanBong.quanHuyen,
      phuongXa: sanBong.phuongXa,
      thanhPho: sanBong.thanhPho,
      moTa: sanBong.moTa,
      hinhAnh: sanBong.hinhAnh,
      daDuyet: sanBong.daDuyet,
      gioMoCua: dayjs(sanBong.gioMoCua, "HH:mm:ss").isValid()
        ? dayjs(sanBong.gioMoCua, "HH:mm:ss").format("HH:mm")
        : "",
      gioDongCua: dayjs(sanBong.gioDongCua, "HH:mm:ss").isValid()
        ? dayjs(sanBong.gioDongCua, "HH:mm:ss").format("HH:mm")
        : "",
      createdAt: sanBong.createdAt,
      updatedAt: sanBong.updatedAt,
      viDo: sanBong.viDo,
      kinhDo: sanBong.kinhDo,
      media: (sanBong.media || []).map(({ ten, link, loaiMedia, mediaId }) => ({
        ten,
        link,
        loaiMedia,
        mediaId,
      })),
    };

    return new ServiceResponse(
      ResponseStatus.Success,
      "Cập nhật sân bóng thành công",
      finalSanBong,
      200,
    );
  }

  async getAllSanBong(
    filter: SanBongFilterDTO,
    user: { maNguoiDung: string; vaiTro: string },
  ): Promise<
    ServiceResponse<{
      data: SanBong[];
      total: number;
      page: number;
      limit: number;
    } | null>
  > {
    const {
      search,
      tenSan,
      quanHuyen,
      phuongXa,
      diaChi,
      viDo,
      kinhDo,
      page = 1,
      limit = 10,
    } = filter;

    try {
      const conditions: string[] = [];
      const params: Record<string, any> = {};

      if (search) {
        const searchTrim = search.trim().toLowerCase();
        const keywords = searchTrim.split(/\s+/);
        keywords.forEach((kw, idx) => {
          conditions.push(
            `(LOWER(sanBong.tenSan) LIKE :search_kw${idx} OR LOWER(sanBong.diaChi) LIKE :search_kw${idx})`,
          );
          params[`search_kw${idx}`] = `%${kw}%`;
        });
      } else {
        if (tenSan) {
          const tenSanTrim = tenSan.trim();
          conditions.push("LOWER(sanBong.tenSan) LIKE :tenSan");
          params.tenSan = `%${tenSanTrim.toLowerCase()}%`;
        }
        if (diaChi) {
          const diaChiTrim = diaChi.trim().toLowerCase();
          const keywords = diaChiTrim.split(/\s+/);
          keywords.forEach((kw, idx) => {
            conditions.push(`LOWER(sanBong.diaChi) LIKE :diaChi_kw${idx}`);
            params[`diaChi_kw${idx}`] = `%${kw}%`;
          });
        }
      }

      if (quanHuyen) {
        conditions.push("sanBong.quanHuyen = :quanHuyen");
        params.quanHuyen = quanHuyen;
      }

      if (phuongXa) {
        conditions.push("sanBong.phuongXa = :phuongXa");
        params.phuongXa = phuongXa;
      }

      if (user.vaiTro !== "admin") {
        conditions.push("sanBong.daDuyet = true");
      }

      const countQuery = sanBongRepo.createQueryBuilder("sanBong");

      if (conditions.length > 0) {
        countQuery.where(conditions.join(" AND "), params);
      }

      if (viDo !== undefined && kinhDo !== undefined) {
        countQuery.andWhere(
          "sanBong.viDo IS NOT NULL AND sanBong.kinhDo IS NOT NULL",
        );
      }

      const query = sanBongRepo.createQueryBuilder("sanBong");

      if (conditions.length > 0) {
        query.where(conditions.join(" AND "), params);
      }

      // if (viDo !== undefined && kinhDo !== undefined) {
      //     params.viDo = viDo;
      //     params.kinhDo = kinhDo;

      //     query.addSelect(
      //         `ST_Distance_Sphere(
      //             point(sanBong.kinhDo, sanBong.viDo),
      //             point(:kinhDo, :viDo)
      //         )`,
      //         "distance"
      //     );

      //     query.andWhere("sanBong.viDo IS NOT NULL AND sanBong.kinhDo IS NOT NULL");
      //     query.orderBy("distance", "ASC");
      // } else {
      //     query.andWhere("sanBong.viDo IS NOT NULL AND sanBong.kinhDo IS NOT NULL");
      //     query.orderBy("sanBong.createdAt", "DESC");
      // }

      if (viDo !== undefined && kinhDo !== undefined) {
        params.viDo = viDo;
        params.kinhDo = kinhDo;
        params.maxDistance = 3000; // Giới hạn tối đa 3km (3000 mét)

        // Thêm điều kiện khoảng cách cho cả countQuery và query
        const distanceCondition = `
                    ST_Distance_Sphere(
                        point(sanBong.kinhDo, sanBong.viDo),
                        point(:kinhDo, :viDo)
                    ) <= :maxDistance
                `;

        countQuery.andWhere(distanceCondition);
        query.andWhere(distanceCondition);

        // Tính khoảng cách cho query
        query.addSelect(
          `ST_Distance_Sphere(
                        point(sanBong.kinhDo, sanBong.viDo),
                        point(:kinhDo, :viDo)
                    )`,
          "distance",
        );

        // Giới hạn khoảng cách tối đa cho query
        query.andWhere(`
                    ST_Distance_Sphere(
                        point(sanBong.kinhDo, sanBong.viDo),
                        point(:kinhDo, :viDo)
                    ) <= :maxDistance
                `);

        // Lọc sân có tọa độ hợp lệ cho cả query và countQuery
        query.andWhere(
          "sanBong.viDo IS NOT NULL AND sanBong.kinhDo IS NOT NULL",
        );
        countQuery.andWhere(
          "sanBong.viDo IS NOT NULL AND sanBong.kinhDo IS NOT NULL",
        );

        // Sắp xếp theo khoảng cách tăng dần
        query.orderBy("distance", "ASC");
      }

      countQuery.setParameters(params);
      const total = await countQuery.getCount();

      query.setParameters(params);
      query.skip((page - 1) * limit).take(limit);

      const result = await query.getRawAndEntities();
      const entities = result.entities;

      // Lấy danh sách mã sân bóng
      const maSanBongList = entities.map((entity) => entity.maSanBong);

      // Nếu không có sân bóng nào thì trả về luôn, tránh lỗi IN () và đảm bảo total = 0
      if (maSanBongList.length === 0) {
        return new ServiceResponse(
          ResponseStatus.Success,
          "Lấy danh sách sân bóng thành công",
          { data: [], total: 0, page, limit },
          200,
        );
      }

      // Lấy media cho tất cả sân bóng
      // Dùng relations để lấy luôn trường sanBong.maSanBong
      const mediaList = await mediaRepo
        .createQueryBuilder("media")
        .leftJoinAndSelect("media.sanBong", "sanBong")
        .where("media.sanBong IN (:...maSanBongList)", {
          maSanBongList,
        })
        .orderBy("media.createdAt", "ASC")
        .getMany();

      // Gom media theo maSanBong
      const mediaMap: Record<string, any[]> = {};
      mediaList.forEach((media) => {
        // Đảm bảo lấy đúng mã sân bóng
        const maSanBong = media.sanBong?.maSanBong;
        if (!maSanBong) return;
        if (!mediaMap[maSanBong]) mediaMap[maSanBong] = [];
        mediaMap[maSanBong].push({
          ten: media.ten,
          link: media.link,
          loaiMedia: media.loaiMedia,
          mediaId: media.mediaId,
        });
      });

      // Lấy điểm trung bình đánh giá cho tất cả sân bóng trong trang hiện tại
      const danhGiaTrungBinhRows = await danhGiaRepo
        .createQueryBuilder("danhGia")
        .select("danhGia.maSanBong", "maSanBong")
        .addSelect("AVG(danhGia.diemSo)", "diemTrungBinhDanhGia")
        .where("danhGia.maSanBong IN (:...maSanBongList)", {
          maSanBongList,
        })
        .groupBy("danhGia.maSanBong")
        .getRawMany();

      const danhGiaTrungBinhMap: Record<string, number> = {};
      danhGiaTrungBinhRows.forEach((row) => {
        danhGiaTrungBinhMap[row.maSanBong] = Math.round(
          parseFloat(row.diemTrungBinhDanhGia) * 10,
        ) / 10;
      });

      // Đếm số lượng sân bóng chi tiết cho từng sân
      const sanBongChiTietCounts = await sanBongChiTietRepo
        .createQueryBuilder("sanBongChiTiet")
        .select("sanBongChiTiet.maSanBong", "maSanBong")
        .addSelect("COUNT(*)", "count")
        .where("sanBongChiTiet.maSanBong IN (:...maSanBongList)", {
          maSanBongList,
        })
        .groupBy("sanBongChiTiet.maSanBong")
        .getRawMany();

      const chiTietCountMap: Record<string, number> = {};
      sanBongChiTietCounts.forEach((row) => {
        chiTietCountMap[row.maSanBong] = parseInt(row.count, 10);
      });

      const dataWithAvg = entities.map((entity) => ({
        ...entity,
        diemTrungBinhDanhGia: danhGiaTrungBinhMap[entity.maSanBong] ?? null,
        distance: 0,
        media: mediaMap[entity.maSanBong] || [],
        soLuongSanChiTiet: chiTietCountMap[entity.maSanBong] || 0,
      }));

      if (viDo !== undefined && kinhDo !== undefined) {
        const rawData = result.raw;
        dataWithAvg.forEach((item, index) => {
          item.distance = rawData[index]?.distance
            ? Math.round(parseFloat(rawData[index].distance) / 100) / 10
            : 0;
        });
      }

      return new ServiceResponse(
        ResponseStatus.Success,
        "Lấy danh sách sân bóng thành công",
        { data: dataWithAvg, total, page, limit },
        200,
      );
    } catch (error) {
      console.error("Lỗi truy vấn sân bóng:", error);
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Lấy danh sách sân bóng thất bại",
        null,
        500,
      );
    }
  }

  async getOneSanBong(
    maSanBong: string,
    user: { maNguoiDung: string; vaiTro: string },
  ): Promise<ServiceResponse<any>> {
    try {
      const sanBong = await sanBongRepo.findOne({
        where: { maSanBong },
        relations: ["media"],
      });

      if (!sanBong) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Không tìm thấy sân bóng",
          null,
          404,
        );
      }

      // Điểm trung bình
      const result = await danhGiaRepo
        .createQueryBuilder("danhGia")
        .select("AVG(danhGia.diemSo)", "avg")
        .where("danhGia.maSanBong = :maSanBong", { maSanBong })
        .getRawOne();

      const diemTrungBinh =
        result?.avg !== null && result?.avg !== undefined
          ? Math.round(parseFloat(result.avg) * 10) / 10
          : null;

      // Đếm số lượng sân bóng chi tiết giống getAllSanBong (dùng queryBuilder)
      const chiTietCountResult = await sanBongChiTietRepo
        .createQueryBuilder("sanBongChiTiet")
        .where("sanBongChiTiet.maSanBong = :maSanBong", { maSanBong })
        .getCount();

      // Map media
      const media = (sanBong.media || []).map(
        ({ ten, link, loaiMedia, mediaId }) => ({
          ten,
          link,
          loaiMedia,
          mediaId,
        }),
      );

      // Sử dụng mapSanBongResponse để format giờ
      return new ServiceResponse(
        ResponseStatus.Success,
        "Lấy thông tin sân bóng thành công",
        this.mapSanBongResponse(sanBong, {
          diemTrungBinhDanhGia: diemTrungBinh,
          distance: null,
          media,
          soLuongSanChiTiet: chiTietCountResult,
        }),
        200,
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Lấy thông tin sân bóng thất bại",
        null,
        500,
      );
    }
  }

  private mapSanBongResponse(
    sanBong: SanBong & { media?: any },
    extra: any = {},
  ) {
    return {
      ...sanBong,
      gioMoCua: dayjs(sanBong.gioMoCua, "HH:mm:ss").isValid()
        ? dayjs(sanBong.gioMoCua, "HH:mm:ss").format("HH:mm")
        : "",
      gioDongCua: dayjs(sanBong.gioDongCua, "HH:mm:ss").isValid()
        ? dayjs(sanBong.gioDongCua, "HH:mm:ss").format("HH:mm")
        : "",
      ...extra,
    };
  }
}
