/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { NguoiDung } from "./nguoi-dung.entity";
import { DateTimeEntity } from "../base/datetime.entity";

@Entity("YEUCAURUTTIEN")
export class YeuCauRutTien extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    maYeuCau: string;

    @ManyToOne(() => NguoiDung)
    @JoinColumn({ name: "maNguoiDung" })
    maNguoiDung: NguoiDung;

    @Column()
    thoiGianRut: Date;

    @Column()
    maGiaoDich: string;

    @Column({ nullable: true })
    moTa: string;

    @Column()
    trangThai: string;

    @Column({ type: "decimal" })
    soTien: number;

    @Column()
    tenNganHang: string;

    @Column()
    soTaiKhoan: string;
}
