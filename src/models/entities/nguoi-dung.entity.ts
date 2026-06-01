/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "../base/datetime.entity";
import { VaiTro } from "../enums/vaiTro.enum";

@Entity("NGUOIDUNG")
export class NguoiDung extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    maNguoiDung: string;

    @Column({ nullable: true })
    avatar: string;

    @Column()
    hoTen: string;

    @Column({ unique: true })
    email: string;

    @Column()
    soDienThoai: string;

    @Column({ default: false })
    daXacThuc: boolean;

    @Column({ type: "varchar", nullable: true })
    maXacThuc: string | null;

    @Column()
    matKhau: string;

    @Column({ default: false })
    taiKhoanGoogle: boolean;

    @Column({
        type: "enum",
        enum: VaiTro,
        default: VaiTro.NGUOI_THUE,
    })
    vaiTro: VaiTro;

    @Column({ type: "decimal", default: 0 })
    soDuTaiKhoan: number;
}