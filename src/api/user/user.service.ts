/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */
import AppDataSource from "@/config/typeorm.config";
import { NguoiDung } from "@/models/entities/nguoi-dung.entity";
import { ResponseStatus, ServiceResponse } from "@/services/serviceResponse";
import { UpdateUserDTO } from "./dto/update-user.dto";

const userRepo = AppDataSource.getRepository(NguoiDung);

export class UserService {
    // async GetAllUsers(): Promise<ServiceResponse<NguoiDung[]>> {
    //     const users = await userRepo.find();
    //     return new ServiceResponse(
    //         ResponseStatus.Success,
    //         'Lấy danh sách người dùng thành công',
    //         users,
    //         200
    //     )
    // }

    // async GetUserById(maNguoiDung: string): Promise<ServiceResponse<NguoiDung | null>> {
    //     const user = await userRepo.findOneBy({ maNguoiDung });
    //     if (!user) {
    //         return new ServiceResponse(
    //             ResponseStatus.Failed,
    //             "Không tìm thấy người dùng",
    //             null,
    //             404
    //         )
    //     }

    //     return new ServiceResponse(
    //         ResponseStatus.Success,
    //         "Lấy thông tin người dùng thành công",
    //         user,
    //         200
    //     )
    // }

    async updateInfoUser(
        maNguoiDung: string,
        data: UpdateUserDTO
    ): Promise<ServiceResponse<NguoiDung | null>> {
        const user = await userRepo.findOneBy({ maNguoiDung });
        if (!user) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy người dùng",
                null,
                404
            );
        }

        user.hoTen = data.hoTen;
        user.soDienThoai = data.soDienThoai;

        if (data.avatar) {
            user.avatar = data.avatar;
        }

        await userRepo.save(user);

        return new ServiceResponse(
            ResponseStatus.Success,
            "Cập nhật thông tin thành công",
            user,
            200
        );
    }

    // async DeleteUser(maNguoiDung: string): Promise<ServiceResponse<NguoiDung | null>> {
    //     const user = await userRepo.findOneBy({ maNguoiDung });
    //     if (!user) {
    //         return new ServiceResponse(
    //             ResponseStatus.Failed,
    //             "Không tìm thấy người dùng",
    //             null,
    //             404
    //         )
    //     }

    //     await userRepo.delete({ maNguoiDung });

    //     return new ServiceResponse(
    //         ResponseStatus.Success,
    //         "Xóa người dùng thành công",
    //         user,
    //         200
    //     )
    // }
}