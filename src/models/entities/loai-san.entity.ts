/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SanBongChiTiet } from "./san-bong-chi-tiet.entity";

@Entity('LOAISAN')
export class LoaiSan {
    @PrimaryGeneratedColumn("uuid")
    maLoaiSan: string;

    @Column()
    tenLoaiSan: string;

    @OneToMany(() => SanBongChiTiet, (sanChiTiet) => sanChiTiet.maLoaiSan)
    sanBongChiTiets: SanBongChiTiet[];
}