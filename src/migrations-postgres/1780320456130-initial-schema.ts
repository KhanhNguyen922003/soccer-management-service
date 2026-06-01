import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1780320456130 implements MigrationInterface {
    name = 'InitialSchema1780320456130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."NGUOIDUNG_vaitro_enum" AS ENUM('admin', 'nguoiThue', 'chuSan')`);
        await queryRunner.query(`CREATE TABLE "NGUOIDUNG" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "maNguoiDung" uuid NOT NULL DEFAULT uuid_generate_v4(), "avatar" character varying, "hoTen" character varying NOT NULL, "email" character varying NOT NULL, "soDienThoai" character varying NOT NULL, "daXacThuc" boolean NOT NULL DEFAULT false, "maXacThuc" character varying, "matKhau" character varying NOT NULL, "taiKhoanGoogle" boolean NOT NULL DEFAULT false, "vaiTro" "public"."NGUOIDUNG_vaitro_enum" NOT NULL DEFAULT 'nguoiThue', "soDuTaiKhoan" numeric NOT NULL DEFAULT '0', CONSTRAINT "UQ_6a6d29b01e39935d2e444b3e2de" UNIQUE ("email"), CONSTRAINT "PK_c118520bcdfdac2378ac543e088" PRIMARY KEY ("maNguoiDung"))`);
        await queryRunner.query(`CREATE TABLE "MEDIA_SANBONG" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "maMedia" uuid NOT NULL DEFAULT uuid_generate_v4(), "loaiMedia" character varying NOT NULL, "ten" character varying NOT NULL, "link" character varying NOT NULL, "mediaId" character varying NOT NULL, "maSanBong" uuid, CONSTRAINT "PK_bba675498cee2935a77ee288a6c" PRIMARY KEY ("maMedia"))`);
        await queryRunner.query(`CREATE TABLE "SANBONG" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "maSanBong" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenSan" character varying NOT NULL, "diaChi" character varying NOT NULL, "quanHuyen" character varying NOT NULL, "phuongXa" character varying NOT NULL, "thanhPho" character varying NOT NULL, "viDo" double precision, "kinhDo" double precision, "moTa" character varying NOT NULL, "hinhAnh" character varying, "daDuyet" boolean NOT NULL DEFAULT false, "gioMoCua" TIME NOT NULL, "gioDongCua" TIME NOT NULL, "daBiDisable" boolean NOT NULL DEFAULT false, "chuSan" uuid, CONSTRAINT "PK_1e119719c25a99622027a7290ab" PRIMARY KEY ("maSanBong"))`);
        await queryRunner.query(`CREATE TABLE "DATSAN" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "maDatSan" uuid NOT NULL DEFAULT uuid_generate_v4(), "ngayDat" TIMESTAMP NOT NULL, "ngayThanhToan" TIMESTAMP NOT NULL, "soTien" numeric NOT NULL, "nguoiThue" uuid, CONSTRAINT "PK_3246d6f2d3141740e55ff52a4de" PRIMARY KEY ("maDatSan"))`);
        await queryRunner.query(`CREATE TABLE "LOAIHINHDAT" ("maLoaiDat" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenLoaiDat" character varying NOT NULL, "code" character varying, CONSTRAINT "UQ_5da1c60efd282a49c84dbfd3f5b" UNIQUE ("code"), CONSTRAINT "PK_963ed42f3f65a06916cb779e6df" PRIMARY KEY ("maLoaiDat"))`);
        await queryRunner.query(`CREATE TABLE "LOAISAN" ("maLoaiSan" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenLoaiSan" character varying NOT NULL, CONSTRAINT "PK_6e3fd2b01c52f825f1f559e894e" PRIMARY KEY ("maLoaiSan"))`);
        await queryRunner.query(`CREATE TABLE "MEDIA_SANBONGCHITIET" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "maMedia" uuid NOT NULL DEFAULT uuid_generate_v4(), "loaiMedia" character varying NOT NULL, "ten" character varying NOT NULL, "link" character varying NOT NULL, "mediaId" character varying NOT NULL, "maSanBongChiTiet" uuid, CONSTRAINT "PK_abec9b3cde3475d826563bf305d" PRIMARY KEY ("maMedia"))`);
        await queryRunner.query(`CREATE TABLE "SANBONGCHITIET" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "maSanChiTiet" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenSanChiTiet" character varying NOT NULL, "giaThueBuoiSang" numeric NOT NULL, "giaThueBuoiToi" numeric NOT NULL, "maSanBong" uuid, "maLoaiSan" uuid, CONSTRAINT "PK_4b9cf634cb6aba91eab2853db16" PRIMARY KEY ("maSanChiTiet"))`);
        await queryRunner.query(`CREATE TABLE "CHITIETDATSAN" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "maChiTietDatSan" uuid NOT NULL DEFAULT uuid_generate_v4(), "gioBatDau" character varying NOT NULL, "gioKetThuc" character varying NOT NULL, "coVanDe" boolean NOT NULL DEFAULT false, "trangThaiDatSan" character varying NOT NULL, "soTien" numeric NOT NULL DEFAULT '0', "daGuiThongBao" boolean NOT NULL DEFAULT false, "maDatSan" uuid, "maSanChiTiet" uuid, "nguoiThue" uuid, "maLoaiDat" uuid, CONSTRAINT "PK_9a18d3e093ac2c951caa14e5acf" PRIMARY KEY ("maChiTietDatSan"))`);
        await queryRunner.query(`CREATE TABLE "DANHGIA" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "maDanhGia" uuid NOT NULL DEFAULT uuid_generate_v4(), "diemSo" integer NOT NULL, "binhLuan" character varying NOT NULL, "thoiGianDanhGia" TIMESTAMP NOT NULL, "nguoiThue" uuid, "maSanBong" uuid, CONSTRAINT "PK_be729190d0537e28d598f0a44ed" PRIMARY KEY ("maDanhGia"))`);
        await queryRunner.query(`CREATE TABLE "CHAT" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "maTinNhan" uuid NOT NULL DEFAULT uuid_generate_v4(), "noiDung" character varying NOT NULL, "thoiGianGui" TIMESTAMP NOT NULL, "nguoiGui" uuid, "nguoiNhan" uuid, CONSTRAINT "PK_5edc2a59578847b814f8fc3b400" PRIMARY KEY ("maTinNhan"))`);
        await queryRunner.query(`CREATE TABLE "NAPTIEN" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "maNapTien" uuid NOT NULL DEFAULT uuid_generate_v4(), "soTien" numeric NOT NULL, "thoiGianNap" TIMESTAMP NOT NULL, "maGiaoDich" character varying NOT NULL, "trangThai" character varying NOT NULL, "nguoiNap" uuid, CONSTRAINT "PK_88f198b4adc2c2863dfdfde297b" PRIMARY KEY ("maNapTien"))`);
        await queryRunner.query(`CREATE TABLE "YEUCAURUTTIEN" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "maYeuCau" uuid NOT NULL DEFAULT uuid_generate_v4(), "thoiGianRut" TIMESTAMP NOT NULL, "maGiaoDich" character varying NOT NULL, "moTa" character varying, "trangThai" character varying NOT NULL, "soTien" numeric NOT NULL, "tenNganHang" character varying NOT NULL, "soTaiKhoan" character varying NOT NULL, "maNguoiDung" uuid, CONSTRAINT "PK_6feaa7eb2827fc4d7eccc9454a0" PRIMARY KEY ("maYeuCau"))`);
        await queryRunner.query(`CREATE TABLE "BAOCAO" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "maBaoCao" uuid NOT NULL DEFAULT uuid_generate_v4(), "lyDo" character varying NOT NULL, "thoiGianBaoCao" TIMESTAMP NOT NULL, "nguoiThue" uuid, "maSanBong" uuid, CONSTRAINT "PK_ab3c652a1fc6ff837fce1116e54" PRIMARY KEY ("maBaoCao"))`);
        await queryRunner.query(`ALTER TABLE "MEDIA_SANBONG" ADD CONSTRAINT "FK_6cb8ba424f2b4c99bd19f42688b" FOREIGN KEY ("maSanBong") REFERENCES "SANBONG"("maSanBong") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "SANBONG" ADD CONSTRAINT "FK_4e61ddf00091a56f8dd3179da2b" FOREIGN KEY ("chuSan") REFERENCES "NGUOIDUNG"("maNguoiDung") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "DATSAN" ADD CONSTRAINT "FK_9bbaae1b80923d2d2b6aea80125" FOREIGN KEY ("nguoiThue") REFERENCES "NGUOIDUNG"("maNguoiDung") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "MEDIA_SANBONGCHITIET" ADD CONSTRAINT "FK_85a71fbdd17fe86d0564276a6d8" FOREIGN KEY ("maSanBongChiTiet") REFERENCES "SANBONGCHITIET"("maSanChiTiet") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "SANBONGCHITIET" ADD CONSTRAINT "FK_89655dd3afeb61d01d5f8eb4376" FOREIGN KEY ("maSanBong") REFERENCES "SANBONG"("maSanBong") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "SANBONGCHITIET" ADD CONSTRAINT "FK_21e190fdd3f6b98d78f31b1b1fc" FOREIGN KEY ("maLoaiSan") REFERENCES "LOAISAN"("maLoaiSan") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CHITIETDATSAN" ADD CONSTRAINT "FK_0ecb6689dc0cf988bbfadc2966c" FOREIGN KEY ("maDatSan") REFERENCES "DATSAN"("maDatSan") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CHITIETDATSAN" ADD CONSTRAINT "FK_4425ce3863183b11dd842002d69" FOREIGN KEY ("maSanChiTiet") REFERENCES "SANBONGCHITIET"("maSanChiTiet") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CHITIETDATSAN" ADD CONSTRAINT "FK_7302626cd5c5bfe41b2cb162bfd" FOREIGN KEY ("nguoiThue") REFERENCES "NGUOIDUNG"("maNguoiDung") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CHITIETDATSAN" ADD CONSTRAINT "FK_c33f18300beef7a2c1959c48ad2" FOREIGN KEY ("maLoaiDat") REFERENCES "LOAIHINHDAT"("maLoaiDat") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "DANHGIA" ADD CONSTRAINT "FK_bab1e1671f866ce19de7ba29590" FOREIGN KEY ("nguoiThue") REFERENCES "NGUOIDUNG"("maNguoiDung") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "DANHGIA" ADD CONSTRAINT "FK_6541b3bea9341324fe2e88df324" FOREIGN KEY ("maSanBong") REFERENCES "SANBONG"("maSanBong") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CHAT" ADD CONSTRAINT "FK_f710c8f87bf3173a50257cb41d2" FOREIGN KEY ("nguoiGui") REFERENCES "NGUOIDUNG"("maNguoiDung") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CHAT" ADD CONSTRAINT "FK_8d97cae72d3829db8699dfdce89" FOREIGN KEY ("nguoiNhan") REFERENCES "NGUOIDUNG"("maNguoiDung") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "NAPTIEN" ADD CONSTRAINT "FK_877f0bbf471b220514ec5460805" FOREIGN KEY ("nguoiNap") REFERENCES "NGUOIDUNG"("maNguoiDung") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "YEUCAURUTTIEN" ADD CONSTRAINT "FK_4fdb18e784b2b09a9cb64bba778" FOREIGN KEY ("maNguoiDung") REFERENCES "NGUOIDUNG"("maNguoiDung") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "BAOCAO" ADD CONSTRAINT "FK_c16acfb783e1ba1db276bbfef49" FOREIGN KEY ("nguoiThue") REFERENCES "NGUOIDUNG"("maNguoiDung") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "BAOCAO" ADD CONSTRAINT "FK_344c9ea1dd49f612f18e2a6802c" FOREIGN KEY ("maSanBong") REFERENCES "SANBONG"("maSanBong") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "BAOCAO" DROP CONSTRAINT "FK_344c9ea1dd49f612f18e2a6802c"`);
        await queryRunner.query(`ALTER TABLE "BAOCAO" DROP CONSTRAINT "FK_c16acfb783e1ba1db276bbfef49"`);
        await queryRunner.query(`ALTER TABLE "YEUCAURUTTIEN" DROP CONSTRAINT "FK_4fdb18e784b2b09a9cb64bba778"`);
        await queryRunner.query(`ALTER TABLE "NAPTIEN" DROP CONSTRAINT "FK_877f0bbf471b220514ec5460805"`);
        await queryRunner.query(`ALTER TABLE "CHAT" DROP CONSTRAINT "FK_8d97cae72d3829db8699dfdce89"`);
        await queryRunner.query(`ALTER TABLE "CHAT" DROP CONSTRAINT "FK_f710c8f87bf3173a50257cb41d2"`);
        await queryRunner.query(`ALTER TABLE "DANHGIA" DROP CONSTRAINT "FK_6541b3bea9341324fe2e88df324"`);
        await queryRunner.query(`ALTER TABLE "DANHGIA" DROP CONSTRAINT "FK_bab1e1671f866ce19de7ba29590"`);
        await queryRunner.query(`ALTER TABLE "CHITIETDATSAN" DROP CONSTRAINT "FK_c33f18300beef7a2c1959c48ad2"`);
        await queryRunner.query(`ALTER TABLE "CHITIETDATSAN" DROP CONSTRAINT "FK_7302626cd5c5bfe41b2cb162bfd"`);
        await queryRunner.query(`ALTER TABLE "CHITIETDATSAN" DROP CONSTRAINT "FK_4425ce3863183b11dd842002d69"`);
        await queryRunner.query(`ALTER TABLE "CHITIETDATSAN" DROP CONSTRAINT "FK_0ecb6689dc0cf988bbfadc2966c"`);
        await queryRunner.query(`ALTER TABLE "SANBONGCHITIET" DROP CONSTRAINT "FK_21e190fdd3f6b98d78f31b1b1fc"`);
        await queryRunner.query(`ALTER TABLE "SANBONGCHITIET" DROP CONSTRAINT "FK_89655dd3afeb61d01d5f8eb4376"`);
        await queryRunner.query(`ALTER TABLE "MEDIA_SANBONGCHITIET" DROP CONSTRAINT "FK_85a71fbdd17fe86d0564276a6d8"`);
        await queryRunner.query(`ALTER TABLE "DATSAN" DROP CONSTRAINT "FK_9bbaae1b80923d2d2b6aea80125"`);
        await queryRunner.query(`ALTER TABLE "SANBONG" DROP CONSTRAINT "FK_4e61ddf00091a56f8dd3179da2b"`);
        await queryRunner.query(`ALTER TABLE "MEDIA_SANBONG" DROP CONSTRAINT "FK_6cb8ba424f2b4c99bd19f42688b"`);
        await queryRunner.query(`DROP TABLE "BAOCAO"`);
        await queryRunner.query(`DROP TABLE "YEUCAURUTTIEN"`);
        await queryRunner.query(`DROP TABLE "NAPTIEN"`);
        await queryRunner.query(`DROP TABLE "CHAT"`);
        await queryRunner.query(`DROP TABLE "DANHGIA"`);
        await queryRunner.query(`DROP TABLE "CHITIETDATSAN"`);
        await queryRunner.query(`DROP TABLE "SANBONGCHITIET"`);
        await queryRunner.query(`DROP TABLE "MEDIA_SANBONGCHITIET"`);
        await queryRunner.query(`DROP TABLE "LOAISAN"`);
        await queryRunner.query(`DROP TABLE "LOAIHINHDAT"`);
        await queryRunner.query(`DROP TABLE "DATSAN"`);
        await queryRunner.query(`DROP TABLE "SANBONG"`);
        await queryRunner.query(`DROP TABLE "MEDIA_SANBONG"`);
        await queryRunner.query(`DROP TABLE "NGUOIDUNG"`);
        await queryRunner.query(`DROP TYPE "public"."NGUOIDUNG_vaitro_enum"`);
    }

}
