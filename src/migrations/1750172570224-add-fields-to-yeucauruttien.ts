import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsToYeucauruttien1750172570224 implements MigrationInterface {
    name = 'AddFieldsToYeucauruttien1750172570224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`YEUCAURUTTIEN\` ADD \`soTien\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`YEUCAURUTTIEN\` ADD \`tenNganHang\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`YEUCAURUTTIEN\` ADD \`soTaiKhoan\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`YEUCAURUTTIEN\` DROP COLUMN \`soTaiKhoan\``);
        await queryRunner.query(`ALTER TABLE \`YEUCAURUTTIEN\` DROP COLUMN \`tenNganHang\``);
        await queryRunner.query(`ALTER TABLE \`YEUCAURUTTIEN\` DROP COLUMN \`soTien\``);
    }

}
