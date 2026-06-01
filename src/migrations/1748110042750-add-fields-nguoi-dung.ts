import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsNguoiDung1748110042750 implements MigrationInterface {
    name = 'AddFieldsNguoiDung1748110042750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`NGUOIDUNG\` ADD \`daXacThuc\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`NGUOIDUNG\` ADD \`maXacThuc\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`NGUOIDUNG\` DROP COLUMN \`maXacThuc\``);
        await queryRunner.query(`ALTER TABLE \`NGUOIDUNG\` DROP COLUMN \`daXacThuc\``);
    }

}
