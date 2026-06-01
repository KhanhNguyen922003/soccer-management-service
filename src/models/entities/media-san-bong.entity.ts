/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { SanBong } from "./san-bong.entity";
import { DateTimeEntity } from "../base/datetime.entity";

@Entity('MEDIA_SANBONG')
export class MediaSanBong extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    maMedia: string;

    @ManyToOne(() => SanBong, (sanBong) => sanBong.media, { onDelete: "CASCADE" })
    @JoinColumn({ name: "maSanBong" })
    sanBong: SanBong;

    @Column()
    loaiMedia: string;

    @Column()
    ten: string;

    @Column()
    link: string;

    @Column()
    mediaId: string;
}
