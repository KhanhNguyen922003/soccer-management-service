/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { handleServiceResponse } from '@/services/httpHandlerResponse';
import { SignInDTO } from './dto/sign-in.dto';
import { ResponseStatus } from '@/services/serviceResponse';
import { GoogleSignInDTO } from './dto/google-sign-in.dto';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';

const authService = new AuthService();

export const AuthController = {
    async signUp(req: Request, res: Response): Promise<Response> {
        const signUpData: SignUpDTO = req.body;

        try {
            // Gọi service để đăng ký người dùng
            const serviceResponse = await authService.SignUp(signUpData);

            // Dùng handleServiceResponse để trả về HTTP response
            return handleServiceResponse(serviceResponse, res);
        } catch (error: any) {
            return res.status(500).json({
                message: "Lỗi hệ thống, vui lòng thử lại sau.",
                error: error.message,
            });
        }
    },

    async verifyEmail(req: Request, res: Response) {
        const { maXacThuc } = req.body;
        const response = await authService.VerifyEmail(maXacThuc);
        return handleServiceResponse(response, res);
    },

    async setPassword(req: Request, res: Response) {
        const { maXacThuc, matKhau } = req.body;
        const response = await authService.SetPassword(maXacThuc, matKhau);
        return handleServiceResponse(response, res);
    },

    async signIn(req: Request, res: Response): Promise<Response> {
        const signInData: SignInDTO = req.body;

        try {
            // Gọi service để đăng nhập người dùng
            const serviceResponse = await authService.SignIn(signInData);

            if (
                serviceResponse.status === ResponseStatus.Success &&
                serviceResponse.data
            ) {
                const { access_token, token_type, refresh_token } =
                    serviceResponse.data;

                // Set refresh_token vào cookie HttpOnly
                res.cookie("refresh_token", refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
                });

                return res.status(200).json({
                    message: serviceResponse.message,
                    data: {
                        access_token,
                        token_type,
                    },
                });
            }

            // Dùng handleServiceResponse để trả về HTTP response
            return handleServiceResponse(serviceResponse, res);
        } catch (error: any) {
            return res.status(500).json({
                message: "Lỗi hệ thống, vui lòng thử lại sau.",
                error: error.message,
            });
        }
    },

    async refreshToken(req: Request, res: Response): Promise<Response> {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Không tìm thấy refresh token",
            });
        }

        try {
            // Gọi service để cấp lại access token
            const serviceResponse = await authService.RefreshToken(
                refreshToken
            );

            // Dùng handleServiceResponse để trả về HTTP response
            return handleServiceResponse(serviceResponse, res);
        } catch (error: any) {
            return res.status(500).json({
                message: "Lỗi hệ thống, vui lòng thử lại sau.",
                error: error.message,
            });
        }
    },

    async googleSignIn(req: Request, res: Response): Promise<Response> {
        const data: GoogleSignInDTO = req.body;

        try {
            const serviceResponse = await authService.GoogleSignIn(data);

            if (
                serviceResponse.status === ResponseStatus.Success &&
                serviceResponse.data
            ) {
                const {
                    access_token,
                    refresh_token,
                    token_type,
                    taiKhoanGoogle,
                } = serviceResponse.data;

                // Set refresh_token vào cookie HttpOnly
                res.cookie("refresh_token", refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
                });

                return res.status(200).json({
                    message: serviceResponse.message,
                    data: {
                        access_token,
                        token_type,
                        taiKhoanGoogle,
                    },
                });
            }

            return handleServiceResponse(serviceResponse, res);
        } catch (error: any) {
            return res.status(500).json({
                message: "Lỗi hệ thống, vui lòng thử lại sau.",
                error: error.message,
            });
        }
    },

    async getProfile(
        req: AuthenticatedRequest,
        res: Response
    ): Promise<Response> {
        try {
            const { maNguoiDung } = req.user as { maNguoiDung: string };

            const serviceResponse = await authService.GetProfile(maNguoiDung);

            return handleServiceResponse(serviceResponse, res);
        } catch (error: any) {
            return res.status(500).json({
                message: "Lỗi hệ thống, vui lòng thử lại sau.",
                error: error.message,
            });
        }
    },

    async logout(req: Request, res: Response): Promise<Response> {
        try {
            const serviceResponse = await authService.Logout();

            // Xoá cookie
            res.clearCookie("refresh_token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            return handleServiceResponse(serviceResponse, res);
        } catch (error: any) {
            return res.status(500).json({
                message: "Lỗi hệ thống, vui lòng thử lại sau.",
                error: error.message,
            });
        }
    },
};