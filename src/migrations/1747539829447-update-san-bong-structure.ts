import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSanBongStructure1747539829447 implements MigrationInterface {
    name = 'UpdateSanBongStructure1747539829447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`SANBONG\` DROP COLUMN \`huyen\``);
        await queryRunner.query(`ALTER TABLE \`SANBONG\` DROP COLUMN \`quan\``);
        await queryRunner.query(`ALTER TABLE \`SANBONG\` DROP COLUMN \`xa\``);
        await queryRunner.query(`ALTER TABLE \`SANBONG\` ADD \`quanHuyen\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`SANBONG\` ADD \`phuongXa\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`SANBONG\` DROP COLUMN \`phuongXa\``);
        await queryRunner.query(`ALTER TABLE \`SANBONG\` DROP COLUMN \`quanHuyen\``);
        await queryRunner.query(`ALTER TABLE \`SANBONG\` ADD \`xa\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`SANBONG\` ADD \`quan\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`SANBONG\` ADD \`huyen\` varchar(255) NOT NULL`);
    }

}
