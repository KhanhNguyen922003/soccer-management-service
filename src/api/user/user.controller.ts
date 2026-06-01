/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Request, Response } from "express";
import { UserService } from "./user.service";
import { handleServiceResponse } from "@/services/httpHandlerResponse";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { UpdateUserDTO } from "./dto/update-user.dto";

const userService = new UserService();


export const UserController = {
    // async getAllUsers(req: Request, res: Response): Promise<Response> {
    //     try {
    //         const serviceResponse = await userService.GetAllUsers();

    //         return handleServiceResponse(serviceResponse, res);

    //     } catch (error: any) {
    //         return res.status(500).json({
    //             message: "Lỗi hệ thống, vui lòng thử lại sau.",
    //             error: error.message,
    //         });
    //     }
    // },

    // async getUserById(req: Request, res: Response): Promise<Response> {
    //     const { maNguoiDung } = req.params;

    //     try {
    //         const serviceResponse = await userService.GetUserById(maNguoiDung);

    //         return handleServiceResponse(serviceResponse, res);
    //     } catch (error: any) {
    //         return res.status(500).json({
    //             message: "Lỗi hệ thống, vui lòng thử lại sau.",
    //             error: error.message,
    //         });
    //     }
    // },

    async updateInfoUser(
        req: AuthenticatedRequest,
        res: Response
    ): Promise<Response> {
        const { maNguoiDung } = req.params;
        const { hoTen, soDienThoai } = req.body;
        const currentUserId = req.user?.maNguoiDung;

        if (currentUserId !== maNguoiDung) {
            return res.status(403).json({
                message:
                    "Bạn không có quyền cập nhật thông tin người dùng này.",
            });
        }

        const data: UpdateUserDTO = {
            hoTen,
            soDienThoai,
            // avatar: ''
        };

        if (req.file && "location" in req.file) {
            data.avatar = (req.file as any).location;
        }

        try {
            const serviceResponse = await userService.updateInfoUser(
                maNguoiDung,
                data
            );

            return handleServiceResponse(serviceResponse, res);
        } catch (error: any) {
            return res.status(500).json({
                message: "Lỗi hệ thống, vui lòng thử lại sau.",
                error: error.message,
            });
        }
    },

    // async deleteUser(req: Request, res: Response): Promise<Response> {
    //     const { maNguoiDung } = req.params;

    //     try {
    //         const serviceResponse = await userService.DeleteUser(maNguoiDung);

    //         return handleServiceResponse(serviceResponse, res);
    //     } catch (error: any) {
    //         return res.status(500).json({
    //             message: "Lỗi hệ thống, vui lòng thử lại sau.",
    //             error: error.message,
    //         });
    //     }
    // }
};