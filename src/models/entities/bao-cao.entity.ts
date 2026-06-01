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
import { SanBong } from "./san-bong.entity";
import { DateTimeEntity } from "../base/datetime.entity";

@Entity("BAOCAO")
export class BaoCao extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    maBaoCao: string;

    @ManyToOne(() => NguoiDung)
    @JoinColumn({ name: "nguoiThue" })
    nguoiThue: NguoiDung;

    @ManyToOne(() => SanBong)
    @JoinColumn({ name: "maSanBong" })
    maSanBong: SanBong;

    @Column()
    lyDo: string;

    @Column()
    thoiGianBaoCao: Date;
}
