import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDaGuiThongBaoToChiTietDatSan1749047578467 implements MigrationInterface {
    name = 'AddDaGuiThongBaoToChiTietDatSan1749047578467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` ADD \`daGuiThongBao\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` DROP COLUMN \`daGuiThongBao\``);
    }

}
