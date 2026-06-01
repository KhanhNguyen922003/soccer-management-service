/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "../base/datetime.entity";
import { NguoiDung } from "./nguoi-dung.entity";
import { MediaSanBong } from "./media-san-bong.entity";

@Entity('SANBONG')
export class SanBong extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    maSanBong: string;

    @ManyToOne(() => NguoiDung)
    @JoinColumn({ name: 'chuSan' })
    chuSan: NguoiDung;

    @Column()
    tenSan: string;

    @Column()
    diaChi: string;

    @Column()
    quanHuyen: string;

    @Column()
    phuongXa: string;

    @Column()
    thanhPho: string;

    @Column({ type: 'double precision', nullable: true })
    viDo: number;

    @Column({ type: 'double precision', nullable: true })
    kinhDo: number;

    @Column()
    moTa: string;

    @Column({ nullable: true })
    hinhAnh?: string;

    @Column({ type: 'boolean', default: false })
    daDuyet: boolean;

    @Column({ type: 'time' })
    gioMoCua: string;

    @Column({ type: 'time' })
    gioDongCua: string;

    @Column({ type: 'boolean', default: false })
    daBiDisable: boolean;

    @OneToMany(() => MediaSanBong, (media) => media.sanBong, { cascade: true })
    media: MediaSanBong[];
}