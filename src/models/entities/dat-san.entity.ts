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

@Entity("DATSAN")
export class DatSan extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    maDatSan: string;

    @ManyToOne(() => NguoiDung)
    @JoinColumn({ name: "nguoiThue" })
    nguoiThue: NguoiDung;

    @Column()
    ngayDat: Date;

    @Column()
    ngayThanhToan: Date;

    @Column({ type: "decimal" })
    soTien: number;
}