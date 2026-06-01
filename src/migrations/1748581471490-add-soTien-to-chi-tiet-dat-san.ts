import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoTienToChiTietDatSan1748581471490 implements MigrationInterface {
    name = 'AddSoTienToChiTietDatSan1748581471490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` ADD \`soTien\` decimal NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` DROP COLUMN \`soTien\``);
    }

}
