import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDatetimeColumns1747847798643 implements MigrationInterface {
    name = 'AddDatetimeColumns1747847798643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONG\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONG\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`DATSAN\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`DATSAN\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONGCHITIET\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONGCHITIET\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`SANBONGCHITIET\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`SANBONGCHITIET\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`DANHGIA\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`DANHGIA\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`CHAT\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`CHAT\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`NAPTIEN\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`NAPTIEN\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`YEUCAURUTTIEN\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`YEUCAURUTTIEN\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`YEUCAURUTTIEN\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`YEUCAURUTTIEN\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`NAPTIEN\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`NAPTIEN\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`CHAT\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`CHAT\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`DANHGIA\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`DANHGIA\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`SANBONGCHITIET\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`SANBONGCHITIET\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONGCHITIET\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONGCHITIET\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`DATSAN\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`DATSAN\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONG\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONG\` DROP COLUMN \`createdAt\``);
    }

}
