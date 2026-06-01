import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGioMoCuaGioDongCuaToSanBong1747541718532 implements MigrationInterface {
    name = 'AddGioMoCuaGioDongCuaToSanBong1747541718532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`SANBONG\` ADD \`gioMoCua\` time NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`SANBONG\` ADD \`gioDongCua\` time NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`SANBONG\` DROP COLUMN \`gioDongCua\``);
        await queryRunner.query(`ALTER TABLE \`SANBONG\` DROP COLUMN \`gioMoCua\``);
    }

}
