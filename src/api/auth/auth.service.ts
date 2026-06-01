/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { ResponseStatus, ServiceResponse } from "@/services/serviceResponse";
import { SignUpDTO } from "./dto/sign-up.dto";
import { VaiTro } from "@/models/enums/vaiTro.enum";
import { NguoiDung } from "@/models/entities/nguoi-dung.entity";
import AppDataSource from "@/config/typeorm.config";
import bcrypt from "bcrypt";
import { SignInDTO } from "./dto/sign-in.dto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { GoogleSignInDTO } from "./dto/google-sign-in.dto";
import { v4 as uuidv4 } from "uuid";
import { sendVerifyEmail } from "@/utils/sendMail.util";

const userRepo = AppDataSource.getRepository(NguoiDung);

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
    async SignUp(data: SignUpDTO): Promise<
        ServiceResponse<{
            maNguoiDung: string;
            hoTen: string;
            email: string;
        } | null>
    > {
        const { hoTen, email, soDienThoai, vaiTro } = data;

        if (
            ![VaiTro.NGUOI_THUE, VaiTro.CHU_SAN, VaiTro.ADMIN].includes(
                vaiTro as VaiTro
            )
        ) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Vai trò không hợp lệ",
                null,
                400
            );
        }

        const existing = await userRepo.findOneBy({ email });
        if (existing) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Email đã tồn tại",
                null,
                400
            );
        }

        const maXacThuc = uuidv4();

        const newUser = userRepo.create({
            hoTen,
            email,
            soDienThoai,
            vaiTro: vaiTro as VaiTro,
            daXacThuc: false,
            maXacThuc,
            matKhau: "",
            taiKhoanGoogle: false,
        });

        await userRepo.save(newUser);

        await sendVerifyEmail(email, maXacThuc);

        return new ServiceResponse(
            ResponseStatus.Success,
            "Đăng ký thành công, vui lòng kiểm tra email để xác thực tài khoản",
            {
                maNguoiDung: newUser.maNguoiDung,
                hoTen: newUser.hoTen,
                email: newUser.email,
            },
            201
        );
    }

    async VerifyEmail(maXacThuc: string): Promise<ServiceResponse<null>> {
        const user = await userRepo.findOneBy({ maXacThuc });

        if (!user) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Mã xác thực không hợp lệ",
                null,
                400
            );
        }

        return new ServiceResponse(
            ResponseStatus.Success,
            "Xác thực thành công, vui lòng đặt mật khẩu",
            null,
            200
        );
    }

    async SetPassword(
        maXacThuc: string,
        matKhau: string
    ): Promise<
        ServiceResponse<{
            access_token: string;
            refresh_token: string;
            token_type: string;
        } | null>
    > {
        const user = await userRepo.findOneBy({ maXacThuc });

        if (!user) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Mã xác thực không hợp lệ",
                null,
                400
            );
        }
        user.matKhau = await bcrypt.hash(matKhau, 10);
        user.daXacThuc = true;
        user.maXacThuc = null;

        await userRepo.save(user);

        const access_token = jwt.sign(
            {
                maNguoiDung: user.maNguoiDung,
                email: user.email,
                vaiTro: user.vaiTro,
            },
            process.env.JWT_SECRET || "default-secret",
            { expiresIn: "1h" }
        );

        const refresh_token = jwt.sign(
            {
                maNguoiDung: user.maNguoiDung,
            },
            process.env.JWT_SECRET || "default-secret",
            { expiresIn: "7d" }
        );

        return new ServiceResponse(
            ResponseStatus.Success,
            "Đặt mật khẩu thành công",
            {
                access_token,
                refresh_token,
                token_type: "bearer",
            },
            200
        );
    }

    async SignIn(data: SignInDTO): Promise<
        ServiceResponse<{
            access_token: string;
            refresh_token: string;
            token_type: string;
        } | null>
    > {
        const { email, matKhau } = data;

        const user = await userRepo.findOneBy({ email });
        if (!user) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Thông tin đăng nhập không chính xác",
                null,
                404
            );
        }

        const isPasswordValid = await bcrypt.compare(matKhau, user.matKhau);
        if (!isPasswordValid) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Thông tin đăng nhập không chính xác",
                null,
                401
            );
        }

        const access_token = jwt.sign(
            {
                maNguoiDung: user.maNguoiDung,
                email: user.email,
                vaiTro: user.vaiTro,
            },
            process.env.JWT_SECRET || "default-secret",
            { expiresIn: "1h" }
        );

        const refresh_token = jwt.sign(
            {
                maNguoiDung: user.maNguoiDung,
            },
            process.env.JWT_SECRET || "default-secret",
            { expiresIn: "7d" }
        );

        return new ServiceResponse(
            ResponseStatus.Success,
            "Đăng nhập thành công",
            {
                access_token,
                refresh_token,
                token_type: "bearer",
            },
            200
        );
    }

    async RefreshToken(
        refreshToken: string
    ): Promise<ServiceResponse<{ access_token: string } | null>> {
        try {
            // Kiểm tra tính hợp lệ của refresh token
            const decoded: any = jwt.verify(
                refreshToken,
                process.env.JWT_SECRET || "default-secret"
            );

            const user = await userRepo.findOneBy({
                maNguoiDung: decoded.maNguoiDung,
            });
            if (!user) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Không tìm thấy người dùng",
                    null,
                    404
                );
            }

            // Tạo một access token mới
            const access_token = jwt.sign(
                {
                    maNguoiDung: user.maNguoiDung,
                    email: user.email,
                    vaiTro: user.vaiTro,
                },
                process.env.JWT_SECRET || "default-secret",
                { expiresIn: "1h" }
            );

            return new ServiceResponse(
                ResponseStatus.Success,
                "Cấp lại access token thành công",
                { access_token },
                200
            );
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Refresh token đã hết hạn",
                    null,
                    401
                );
            }

            if (err instanceof jwt.JsonWebTokenError) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Refresh token không hợp lệ",
                    null,
                    400
                );
            }

            throw err;
        }
    }

    async GoogleSignIn(data: GoogleSignInDTO): Promise<
        ServiceResponse<{
            access_token: string;
            refresh_token: string;
            token_type: string;
            taiKhoanGoogle: boolean;
        } | null>
    > {
        const { accessToken, user, vaiTro } = data;

        try {
            if (!user || !user.email) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Không thể xác thực tài khoản Google",
                    null,
                    400
                );
            }

            const { email, name } = user;

            let existingUser = await userRepo.findOneBy({ email });

            if (!existingUser) {
                if (!vaiTro) {
                    return new ServiceResponse(
                        ResponseStatus.Failed,
                        "Tài khoản chưa tồn tại. Vui lòng đăng ký trước",
                        null,
                        400
                    );
                }

                existingUser = userRepo.create({
                    hoTen: name || "Người dùng google",
                    email,
                    matKhau: "",
                    soDienThoai: "",
                    // vaiTro: vaiTro,
                    vaiTro: vaiTro as VaiTro,
                    taiKhoanGoogle: true,
                });
                await userRepo.save(existingUser);
            }

            const access_token = jwt.sign(
                {
                    maNguoiDung: existingUser.maNguoiDung,
                    email: existingUser.email,
                    vaiTro: existingUser.vaiTro,
                },
                process.env.JWT_SECRET || "default-secret",
                { expiresIn: "1h" }
            );

            const refresh_token = jwt.sign(
                {
                    maNguoiDung: existingUser.maNguoiDung,
                },
                process.env.JWT_SECRET || "default-secret",
                { expiresIn: "7d" }
            );

            return new ServiceResponse(
                ResponseStatus.Success,
                "Đăng nhập bằng Google thành công",
                {
                    access_token,
                    refresh_token,
                    token_type: "bearer",
                    taiKhoanGoogle: existingUser.taiKhoanGoogle,
                },
                200
            );
        } catch (error) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Xác thực google thất bại",
                null,
                401
            );
        }
    }

    async GetProfile(
        maNguoiDung: string
    ): Promise<ServiceResponse<Omit<NguoiDung, "matKhau"> | null>> {
        const user = await userRepo.findOneBy({ maNguoiDung });

        if (!user) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Không tìm thấy người dùng",
                null,
                404
            );
        }

        const { matKhau, ...userWithoutPassword } = user;

        // Ép kiểu soDuTaiKhoan về number khi trả về client
        return new ServiceResponse(
            ResponseStatus.Success,
            "Lấy thông tin người dùng thành công",
            {
                ...userWithoutPassword,
                soDuTaiKhoan: Number(userWithoutPassword.soDuTaiKhoan),
            },
            200
        );
    }

    async Logout(): Promise<ServiceResponse<null>> {
        return new ServiceResponse(
            ResponseStatus.Success,
            "Đăng xuất thành công",
            null,
            200
        );
    }
}
