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

@Entity('CHAT')
export class Chat extends DateTimeEntity{
    @PrimaryGeneratedColumn("uuid")
    maTinNhan: string;

    @ManyToOne(() => NguoiDung)
    @JoinColumn({ name: 'nguoiGui' })
    nguoiGui: NguoiDung;

    @ManyToOne(() => NguoiDung)
    @JoinColumn({ name: 'nguoiNhan' })
    nguoiNhan: NguoiDung;

    @Column()
    noiDung: string;

    @Column()
    thoiGianGui: Date;
}
