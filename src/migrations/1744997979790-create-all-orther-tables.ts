import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAllOrtherTables1744997979790 implements MigrationInterface {
    name = 'CreateAllOrtherTables1744997979790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`SANBONG\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`maSanBong\` varchar(36) NOT NULL, \`tenSan\` varchar(255) NOT NULL, \`diaChi\` varchar(255) NOT NULL, \`quan\` varchar(255) NOT NULL, \`huyen\` varchar(255) NOT NULL, \`xa\` varchar(255) NOT NULL, \`thanhPho\` varchar(255) NOT NULL, \`moTa\` varchar(255) NOT NULL, \`hinhAnh\` varchar(255) NOT NULL, \`daDuyet\` tinyint NOT NULL DEFAULT 0, \`chuSan\` varchar(36) NULL, PRIMARY KEY (\`maSanBong\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`DATSAN\` (\`maDatSan\` varchar(36) NOT NULL, \`ngayDat\` datetime NOT NULL, \`ngayThanhToan\` datetime NOT NULL, \`nguoiThue\` varchar(36) NULL, PRIMARY KEY (\`maDatSan\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`LOAIHINHDAT\` (\`maLoaiDat\` varchar(36) NOT NULL, \`tenLoaiDat\` varchar(255) NOT NULL, PRIMARY KEY (\`maLoaiDat\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`CHITIETDATSAN\` (\`maChiTietDatSan\` varchar(36) NOT NULL, \`gioBatDau\` varchar(255) NOT NULL, \`gioKetThuc\` varchar(255) NOT NULL, \`coVanDe\` tinyint NOT NULL DEFAULT 0, \`trangThaiDatSan\` varchar(255) NOT NULL, \`maDatSan\` varchar(36) NULL, \`maSanChiTiet\` varchar(36) NULL, \`nguoiThue\` varchar(36) NULL, \`maLoaiDat\` varchar(36) NULL, PRIMARY KEY (\`maChiTietDatSan\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`LOAISAN\` (\`maLoaiSan\` varchar(36) NOT NULL, \`tenLoaiSan\` varchar(255) NOT NULL, PRIMARY KEY (\`maLoaiSan\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`SANBONGCHITIET\` (\`maSanChiTiet\` varchar(36) NOT NULL, \`tenSanChiTiet\` varchar(255) NOT NULL, \`giaThueBuoiSang\` decimal NOT NULL, \`giaThueBuoiToi\` decimal NOT NULL, \`maSanBong\` varchar(36) NULL, \`maLoaiSan\` varchar(36) NULL, PRIMARY KEY (\`maSanChiTiet\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`DANHGIA\` (\`maDanhGia\` varchar(36) NOT NULL, \`diemSo\` int NOT NULL, \`binhLuan\` varchar(255) NOT NULL, \`thoiGianDanhGia\` datetime NOT NULL, \`nguoiThue\` varchar(36) NULL, \`maSanBong\` varchar(36) NULL, PRIMARY KEY (\`maDanhGia\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`CHAT\` (\`maTinNhan\` varchar(36) NOT NULL, \`noiDung\` varchar(255) NOT NULL, \`thoiGianGui\` datetime NOT NULL, \`nguoiGui\` varchar(36) NULL, \`nguoiNhan\` varchar(36) NULL, PRIMARY KEY (\`maTinNhan\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`NAPTIEN\` (\`maNapTien\` varchar(36) NOT NULL, \`soTien\` decimal NOT NULL, \`thoiGianNap\` datetime NOT NULL, \`maGiaoDich\` varchar(255) NOT NULL, \`trangThai\` varchar(255) NOT NULL, \`nguoiNap\` varchar(36) NULL, PRIMARY KEY (\`maNapTien\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`YEUCAURUTTIEN\` (\`maYeuCau\` varchar(36) NOT NULL, \`thoiGianRut\` datetime NOT NULL, \`maGiaoDich\` varchar(255) NOT NULL, \`moTa\` varchar(255) NOT NULL, \`trangThai\` varchar(255) NOT NULL, \`maNguoiDung\` varchar(36) NULL, PRIMARY KEY (\`maYeuCau\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`MEDIA_SANBONG\` (\`maMedia\` varchar(36) NOT NULL, \`loaiMedia\` varchar(255) NOT NULL, \`ten\` varchar(255) NOT NULL, \`link\` varchar(255) NOT NULL, \`mediaId\` varchar(255) NOT NULL, \`maSanBong\` varchar(36) NULL, PRIMARY KEY (\`maMedia\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`MEDIA_SANBONGCHITIET\` (\`maMedia\` varchar(36) NOT NULL, \`loaiMedia\` varchar(255) NOT NULL, \`ten\` varchar(255) NOT NULL, \`link\` varchar(255) NOT NULL, \`mediaId\` varchar(255) NOT NULL, \`maSanBongChiTiet\` varchar(36) NULL, PRIMARY KEY (\`maMedia\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`SANBONG\` ADD CONSTRAINT \`FK_4e61ddf00091a56f8dd3179da2b\` FOREIGN KEY (\`chuSan\`) REFERENCES \`NGUOIDUNG\`(\`maNguoiDung\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`DATSAN\` ADD CONSTRAINT \`FK_9bbaae1b80923d2d2b6aea80125\` FOREIGN KEY (\`nguoiThue\`) REFERENCES \`NGUOIDUNG\`(\`maNguoiDung\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` ADD CONSTRAINT \`FK_0ecb6689dc0cf988bbfadc2966c\` FOREIGN KEY (\`maDatSan\`) REFERENCES \`DATSAN\`(\`maDatSan\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` ADD CONSTRAINT \`FK_4425ce3863183b11dd842002d69\` FOREIGN KEY (\`maSanChiTiet\`) REFERENCES \`SANBONG\`(\`maSanBong\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` ADD CONSTRAINT \`FK_7302626cd5c5bfe41b2cb162bfd\` FOREIGN KEY (\`nguoiThue\`) REFERENCES \`NGUOIDUNG\`(\`maNguoiDung\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` ADD CONSTRAINT \`FK_c33f18300beef7a2c1959c48ad2\` FOREIGN KEY (\`maLoaiDat\`) REFERENCES \`LOAIHINHDAT\`(\`maLoaiDat\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`SANBONGCHITIET\` ADD CONSTRAINT \`FK_89655dd3afeb61d01d5f8eb4376\` FOREIGN KEY (\`maSanBong\`) REFERENCES \`SANBONG\`(\`maSanBong\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`SANBONGCHITIET\` ADD CONSTRAINT \`FK_21e190fdd3f6b98d78f31b1b1fc\` FOREIGN KEY (\`maLoaiSan\`) REFERENCES \`LOAISAN\`(\`maLoaiSan\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`DANHGIA\` ADD CONSTRAINT \`FK_bab1e1671f866ce19de7ba29590\` FOREIGN KEY (\`nguoiThue\`) REFERENCES \`NGUOIDUNG\`(\`maNguoiDung\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`DANHGIA\` ADD CONSTRAINT \`FK_6541b3bea9341324fe2e88df324\` FOREIGN KEY (\`maSanBong\`) REFERENCES \`SANBONG\`(\`maSanBong\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`CHAT\` ADD CONSTRAINT \`FK_f710c8f87bf3173a50257cb41d2\` FOREIGN KEY (\`nguoiGui\`) REFERENCES \`NGUOIDUNG\`(\`maNguoiDung\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`CHAT\` ADD CONSTRAINT \`FK_8d97cae72d3829db8699dfdce89\` FOREIGN KEY (\`nguoiNhan\`) REFERENCES \`NGUOIDUNG\`(\`maNguoiDung\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`NAPTIEN\` ADD CONSTRAINT \`FK_877f0bbf471b220514ec5460805\` FOREIGN KEY (\`nguoiNap\`) REFERENCES \`NGUOIDUNG\`(\`maNguoiDung\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`YEUCAURUTTIEN\` ADD CONSTRAINT \`FK_4fdb18e784b2b09a9cb64bba778\` FOREIGN KEY (\`maNguoiDung\`) REFERENCES \`NGUOIDUNG\`(\`maNguoiDung\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONG\` ADD CONSTRAINT \`FK_6cb8ba424f2b4c99bd19f42688b\` FOREIGN KEY (\`maSanBong\`) REFERENCES \`SANBONG\`(\`maSanBong\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONGCHITIET\` ADD CONSTRAINT \`FK_85a71fbdd17fe86d0564276a6d8\` FOREIGN KEY (\`maSanBongChiTiet\`) REFERENCES \`SANBONGCHITIET\`(\`maSanChiTiet\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONGCHITIET\` DROP FOREIGN KEY \`FK_85a71fbdd17fe86d0564276a6d8\``);
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONG\` DROP FOREIGN KEY \`FK_6cb8ba424f2b4c99bd19f42688b\``);
        await queryRunner.query(`ALTER TABLE \`YEUCAURUTTIEN\` DROP FOREIGN KEY \`FK_4fdb18e784b2b09a9cb64bba778\``);
        await queryRunner.query(`ALTER TABLE \`NAPTIEN\` DROP FOREIGN KEY \`FK_877f0bbf471b220514ec5460805\``);
        await queryRunner.query(`ALTER TABLE \`CHAT\` DROP FOREIGN KEY \`FK_8d97cae72d3829db8699dfdce89\``);
        await queryRunner.query(`ALTER TABLE \`CHAT\` DROP FOREIGN KEY \`FK_f710c8f87bf3173a50257cb41d2\``);
        await queryRunner.query(`ALTER TABLE \`DANHGIA\` DROP FOREIGN KEY \`FK_6541b3bea9341324fe2e88df324\``);
        await queryRunner.query(`ALTER TABLE \`DANHGIA\` DROP FOREIGN KEY \`FK_bab1e1671f866ce19de7ba29590\``);
        await queryRunner.query(`ALTER TABLE \`SANBONGCHITIET\` DROP FOREIGN KEY \`FK_21e190fdd3f6b98d78f31b1b1fc\``);
        await queryRunner.query(`ALTER TABLE \`SANBONGCHITIET\` DROP FOREIGN KEY \`FK_89655dd3afeb61d01d5f8eb4376\``);
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` DROP FOREIGN KEY \`FK_c33f18300beef7a2c1959c48ad2\``);
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` DROP FOREIGN KEY \`FK_7302626cd5c5bfe41b2cb162bfd\``);
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` DROP FOREIGN KEY \`FK_4425ce3863183b11dd842002d69\``);
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` DROP FOREIGN KEY \`FK_0ecb6689dc0cf988bbfadc2966c\``);
        await queryRunner.query(`ALTER TABLE \`DATSAN\` DROP FOREIGN KEY \`FK_9bbaae1b80923d2d2b6aea80125\``);
        await queryRunner.query(`ALTER TABLE \`SANBONG\` DROP FOREIGN KEY \`FK_4e61ddf00091a56f8dd3179da2b\``);
        await queryRunner.query(`DROP TABLE \`MEDIA_SANBONGCHITIET\``);
        await queryRunner.query(`DROP TABLE \`MEDIA_SANBONG\``);
        await queryRunner.query(`DROP TABLE \`YEUCAURUTTIEN\``);
        await queryRunner.query(`DROP TABLE \`NAPTIEN\``);
        await queryRunner.query(`DROP TABLE \`CHAT\``);
        await queryRunner.query(`DROP TABLE \`DANHGIA\``);
        await queryRunner.query(`DROP TABLE \`SANBONGCHITIET\``);
        await queryRunner.query(`DROP TABLE \`LOAISAN\``);
        await queryRunner.query(`DROP TABLE \`CHITIETDATSAN\``);
        await queryRunner.query(`DROP TABLE \`LOAIHINHDAT\``);
        await queryRunner.query(`DROP TABLE \`DATSAN\``);
        await queryRunner.query(`DROP TABLE \`SANBONG\``);
    }

}
