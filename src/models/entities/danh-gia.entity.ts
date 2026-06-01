/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { NguoiDung } from "./nguoi-dung.entity";
import { SanBong } from "./san-bong.entity";
import { DateTimeEntity } from "../base/datetime.entity";

@Entity('DANHGIA')
export class DanhGia extends DateTimeEntity{
    @PrimaryGeneratedColumn("uuid")
    maDanhGia: string;

    @ManyToOne(() => NguoiDung)
    @JoinColumn({ name: 'nguoiThue' })
    nguoiThue: NguoiDung;

    @ManyToOne(() => SanBong)
    @JoinColumn({ name: 'maSanBong' })
    maSanBong: SanBong;

    @Column({ type: 'int' })
    diemSo: number;

    @Column()
    binhLuan: string;

    @Column()
    thoiGianDanhGia: Date;
}
