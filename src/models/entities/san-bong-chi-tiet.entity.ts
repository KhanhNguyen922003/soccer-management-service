/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { SanBong } from "./san-bong.entity";
import { LoaiSan } from "./loai-san.entity";
import { MediaSanBongChiTiet } from "./media-san-bong-chi-tiet.entity";
import { DateTimeEntity } from "../base/datetime.entity";

@Entity('SANBONGCHITIET')
export class SanBongChiTiet extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    maSanChiTiet: string;

    @ManyToOne(() => SanBong)
    @JoinColumn({ name: 'maSanBong' })
    maSanBong: SanBong;

    @ManyToOne(() => LoaiSan)
    @JoinColumn({ name: 'maLoaiSan' })
    maLoaiSan: LoaiSan;

    @Column()
    tenSanChiTiet: string;

    @Column({ type: 'decimal' })
    giaThueBuoiSang: number;

    @Column({ type: 'decimal' })
    giaThueBuoiToi: number;

    @OneToMany(() => MediaSanBongChiTiet, (media) => media.maSanBongChiTiet)
    media: MediaSanBongChiTiet[];
}
