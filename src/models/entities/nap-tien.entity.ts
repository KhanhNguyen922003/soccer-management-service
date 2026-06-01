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
import { DateTimeEntity } from "../base/datetime.entity";

@Entity('NAPTIEN')
export class NapTien extends DateTimeEntity{
    @PrimaryGeneratedColumn("uuid")
    maNapTien: string;

    @ManyToOne(() => NguoiDung)
    @JoinColumn({ name: 'nguoiNap' })
    nguoiNap: NguoiDung;

    @Column({ type: 'decimal' })
    soTien: number;

    @Column()
    thoiGianNap: Date;

    @Column()
    maGiaoDich: string;

    @Column()
    trangThai: string;
}
