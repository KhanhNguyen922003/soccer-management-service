/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import AppDataSource from "@/config/typeorm.config";
import { SanBongChiTiet } from "@/models/entities/san-bong-chi-tiet.entity";
import { ResponseStatus, ServiceResponse } from "@/services/serviceResponse";
import { CreateSanChiTietDTO } from "./dto/create-san-chi-tiet.dto";
import { SanBong } from "@/models/entities/san-bong.entity";
import { MediaSanBongChiTiet } from "@/models/entities/media-san-bong-chi-tiet.entity";
import { UpdateSanChiTietDTO } from "./dto/update-san-chi-tiet.dto";

const sanBongChiTietRepo = AppDataSource.getRepository(SanBongChiTiet);
const mediaSanBongChiTietRepo = AppDataSource.getRepository(MediaSanBongChiTiet);
const sanBongRepo = AppDataSource.getRepository(SanBong);

export class SanBongChiTietService {
    async createSanBongChiTiet(
        maSanBong: string,
        data: CreateSanChiTietDTO,
        file: any | undefined,
        user: { maNguoiDung: string, vaiTro: string }
    ): Promise<ServiceResponse<SanBongChiTiet | null>> {
        const sanBong = await sanBongRepo.findOne({
            where: {
                maSanBong,
                chuSan: { maNguoiDung: user.maNguoiDung },
            },
        });

        if (!sanBong) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Bạn không có quyền thêm sân con cho sân này",
                null,
                403
            );
        }

        const { tenSanChiTiet, maLoaiSan, giaThueBuoiSang, giaThueBuoiToi } = data;

        if (!file) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Vui lòng upload một hình ảnh sân chi tiết",
                null,
                400
            );
        }
    
        const existingSanChiTiet = await sanBongChiTietRepo
            .createQueryBuilder("sanChiTiet")
            .leftJoin("sanChiTiet.maSanBong", "sanBong")
            .where("sanChiTiet.tenSanChiTiet = :tenSanChiTiet", { tenSanChiTiet })
            .andWhere("sanBong.maSanBong = :maSanBong", { maSanBong })
            .getOne();


        if (existingSanChiTiet) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Tên sân chi tiết này đã tồn tại",
                null,
                400
            );
        }

        const sanChiTiet = sanBongChiTietRepo.create({
            tenSanChiTiet,
            maLoaiSan: { maLoaiSan },
            maSanBong: { maSanBong },
            giaThueBuoiSang,
            giaThueBuoiToi,
        });

        const saved = await sanBongChiTietRepo.save(sanChiTiet);

        const media = mediaSanBongChiTietRepo.create({
            maSanBongChiTiet: saved,
            loaiMedia: (file.mimetype || file.type || '').startsWith("image/") ? "image" : "video",
            ten: file.originalname || file.name || null,
            link: file.url || file.location || file.path || null,
            mediaId: file.public_id || file.key || null,
        });

        await mediaSanBongChiTietRepo.save(media);

        // Lấy lại sân chi tiết kèm media và loại sân
        const sanChiTietWithMedia = await sanBongChiTietRepo.findOne({
            where: { maSanChiTiet: saved.maSanChiTiet },
            relations: ["media", "maLoaiSan"],
        });

        return new ServiceResponse(
            ResponseStatus.Success,
            "Tạo sân chi tiết thành công",
            sanChiTietWithMedia,
            201
        );
    }

    async updateSanBongChiTiet(
        maSanChiTiet: string,
        data: UpdateSanChiTietDTO,
        file: any | undefined,
        user: { maNguoiDung: string }
    ): Promise<ServiceResponse<SanBongChiTiet | null>> {
        const sanChiTiet = await sanBongChiTietRepo.findOne({
            where: { maSanChiTiet },
            relations: ["maSanBong", "maSanBong.chuSan", "media"],
        });

        if (!sanChiTiet || sanChiTiet.maSanBong.chuSan.maNguoiDung !== user.maNguoiDung) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Bạn không có quyền sửa sân chi tiết này",
                null,
                403
            );
        }
    
        // Nếu có cập nhật tên sân chi tiết thì kiểm tra trùng tên
        if (data.tenSanChiTiet && data.tenSanChiTiet !== sanChiTiet.tenSanChiTiet) {
            const existingSanChiTiet = await sanBongChiTietRepo
                .createQueryBuilder("sanChiTiet")
                .leftJoin("sanChiTiet.maSanBong", "sanBong")
                .where("sanChiTiet.tenSanChiTiet = :tenSanChiTiet", { tenSanChiTiet: data.tenSanChiTiet })
                .andWhere("sanBong.maSanBong = :maSanBong", { maSanBong: sanChiTiet.maSanBong.maSanBong })
                .andWhere("sanChiTiet.maSanChiTiet != :maSanChiTiet", { maSanChiTiet }) // loại chính nó ra
                .getOne();

            if (existingSanChiTiet) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Tên sân chi tiết này đã tồn tại",
                    null,
                    400
                );
            }
        }

        // Update các trường thông tin
        sanBongChiTietRepo.merge(sanChiTiet, {
            ...data,
            maLoaiSan: data.maLoaiSan ? { maLoaiSan: data.maLoaiSan } : sanChiTiet.maLoaiSan,
        });

        const saved = await sanBongChiTietRepo.save(sanChiTiet);

        if (file) {
            // Xóa media cũ
            if (sanChiTiet.media && sanChiTiet.media.length > 0) {
                await mediaSanBongChiTietRepo.remove(sanChiTiet.media);
            }

            const newMedia = mediaSanBongChiTietRepo.create({
                maSanBongChiTiet: sanChiTiet,
                loaiMedia: (file.mimetype || file.type || '').startsWith("image/") ? "image" : "video",
                ten: file.originalname || file.name || null,
                link: file.url || file.location || file.path || null,
                mediaId: file.public_id || file.key || null,
            });

            await mediaSanBongChiTietRepo.save(newMedia);
        }

        // Lấy lại dữ liệu cập nhật kèm media và loại sân
        const updated = await sanBongChiTietRepo.findOne({
            where: { maSanChiTiet: saved.maSanChiTiet },
            relations: ["maLoaiSan", "media"],
        });

        return new ServiceResponse(
            ResponseStatus.Success,
            "Cập nhật sân chi tiết thành công",
            updated,
            200
        );
    }

    async deleteSanBongChiTiet(maSanChiTiet: string, user: { maNguoiDung: string}): Promise<ServiceResponse<null>> {
        const sanChiTiet = await sanBongChiTietRepo.findOne({
            where: { maSanChiTiet },
            relations: ["maSanBong", "maSanBong.chuSan"],
        })

        if (!sanChiTiet || sanChiTiet.maSanBong.chuSan.maNguoiDung !== user.maNguoiDung) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Bạn không có quyền xóa sân chi tiết này",
                null,
                403
            );
        }

        await sanBongChiTietRepo.delete(maSanChiTiet);

        return new ServiceResponse(
            ResponseStatus.Success,
            "Xóa sân chi tiết thành công",
            null,
            200
        )
    }

    async getAllSanBongChiTiet(
        maSanBong: string,
        query: { tenSanChiTiet?: string; maLoaiSan?: string; page: number, limit: number },
    ): Promise<ServiceResponse<any>> {
        let { tenSanChiTiet, maLoaiSan, page = 1, limit = 10 } = query;

        if (tenSanChiTiet) {
            tenSanChiTiet = tenSanChiTiet.trim().replace(/\s+/g, ' ').toLowerCase();
        }

        const qb = sanBongChiTietRepo
            .createQueryBuilder("s")
            .leftJoinAndSelect("s.media", "media")
            .leftJoinAndSelect("s.maLoaiSan", "loaiSan")
            .where("s.maSanBong = :maSanBong", { maSanBong });
        
        if (tenSanChiTiet) {
            qb.andWhere("LOWER(s.tenSanChiTiet) LIKE LOWER(:ten)", { ten: `%${tenSanChiTiet}%` });
        }

        if (maLoaiSan) {
            qb.andWhere("s.maLoaiSan = :maLoaiSan", { maLoaiSan });
        }

        qb.orderBy("s.tenSanChiTiet", "ASC");

        const [data, total] = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        
        const mappedData = data.map(({ maLoaiSan, ...rest }) => ({
            ...rest,
            tenLoaiSan: maLoaiSan?.tenLoaiSan || null,
        }));

        return new ServiceResponse(
            ResponseStatus.Success,
            "Lấy danh sách sân chi tiết thành công",
            {
                data: mappedData,
                total,
                page,
                limit,
                totalPage: Math.ceil(total / limit),
            },
            200
        )
    }

    async getOneSanBongChiTiet(maSanChiTiet: string): Promise<ServiceResponse<any>> {
        const sanChiTiet = await sanBongChiTietRepo.findOne({
            where: { maSanChiTiet },
            relations: ["media", "maLoaiSan"],
        });

        if (!sanChiTiet) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy sân bóng chi tiết",
                null,
                404
            );
        }

        // Map dữ liệu để trả về thông tin cần thiết
        const mappedData = {
            createdAt: sanChiTiet.createdAt,
            updatedAt: sanChiTiet.updatedAt,
            maSanChiTiet: sanChiTiet.maSanChiTiet,
            tenSanChiTiet: sanChiTiet.tenSanChiTiet,
            giaThueBuoiSang: sanChiTiet.giaThueBuoiSang,
            giaThueBuoiToi: sanChiTiet.giaThueBuoiToi,
            media: sanChiTiet.media.map((m) => ({
                createdAt: m.createdAt,
                updatedAt: m.updatedAt,
                maMedia: m.maMedia,
                loaiMedia: m.loaiMedia,
                ten: m.ten,
                link: m.link,
                mediaId: m.mediaId,
            })),
            maLoaiSan: sanChiTiet.maLoaiSan?.maLoaiSan || null,
            tenLoaiSan: sanChiTiet.maLoaiSan?.tenLoaiSan || null,
        };

        return new ServiceResponse(
            ResponseStatus.Success,
            "Lấy thông tin sân bóng chi tiết thành công",
            mappedData,
            200
        );
    }
}