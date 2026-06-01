import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTaiKhoanGoogleToNguoiDung1746546878801 implements MigrationInterface {
    name = 'AddTaiKhoanGoogleToNguoiDung1746546878801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`NGUOIDUNG\` ADD \`taiKhoanGoogle\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`NGUOIDUNG\` DROP COLUMN \`taiKhoanGoogle\``);
    }

}
