/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { SanBongChiTiet } from "./san-bong-chi-tiet.entity";
import { DateTimeEntity } from "../base/datetime.entity";

@Entity('MEDIA_SANBONGCHITIET')
export class MediaSanBongChiTiet extends DateTimeEntity{
    @PrimaryGeneratedColumn("uuid")
    maMedia: string;

    @ManyToOne(() => SanBongChiTiet, (sanBongChiTiet) => sanBongChiTiet.media, {
    onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'maSanBongChiTiet' })
    maSanBongChiTiet: SanBongChiTiet;

    @Column()
    loaiMedia: string;

    @Column()
    ten: string;

    @Column()
    link: string;

    @Column()
    mediaId: string;
}
