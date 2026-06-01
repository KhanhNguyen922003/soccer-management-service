/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import express, { Request, Response } from 'express'
import authRouter from './api/auth/auth.route'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './api/user/user.route';
import sanBongRouter from './api/san-bong/san-bong.route';
import loaiSanRouter from './api/loai-san/loaiSan.route';
import sanBongChiTietRouter from './api/san-bong-chi-tiet/san-bong-chi-tiet.route';
import adminRouter from './api/admin/admin.route';
import paymentRouter from './api/payment/payment.route';
import lichSuGiaoDichRouter from './api/lich-su-giao-dich/lichSuGiaoDich.route';
import datSanRouter from './api/dat-san/dat-san.route';
import loaiHinhDatRouter from './api/loai-hinh-dat/loai-hinh-dat.route';
import danhGiaRouter from './api/danh-gia/danh-gia.route';
import yeuCauRutTienRouter from './api/yeu-cau-rut-tien/yeu-cau-rut-tien.route';
import baoCaoRouter from './api/bao-cao/bao-cao.route';

const app = express()

// Cấu hình CORS (cho phép tất cả các nguồn)
// app.use(cors());

// Nếu muốn chỉ định các nguồn cho phép, có thể cấu hình như sau:
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://nh11-soccer-booking-ui.vercel.app",
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
            "https://chothuesanbongdn.netlify.app"
        ], // Chỉ cho phép frontend từ localhost:3000 và https://nh11-soccer-booking-ui.vercel.app/
        // origin: "*",
        credentials: true, // Cho phép gửi cookie từ frontend
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Các phương thức cho phép
        // methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"], // Các header cho phép
    })
);

app.use(cookieParser());

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript!')
})

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/san-bong', sanBongRouter);
app.use('/api/loai-san', loaiSanRouter);
app.use('/api/san-bong-chi-tiet', sanBongChiTietRouter);
app.use('/api/admin', adminRouter);
app.use('/api/payment', paymentRouter);
app.use("/api/lich-su-giao-dich", lichSuGiaoDichRouter);
app.use('/api/loai-hinh-dat', loaiHinhDatRouter);
app.use('/api/dat-san', datSanRouter);
app.use("/api/danh-gia", danhGiaRouter);
app.use('/api/yeu-cau-rut-tien', yeuCauRutTienRouter);
app.use('/api/bao-cao', baoCaoRouter);

export default app
