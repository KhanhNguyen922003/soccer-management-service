import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDaBiDisableToSanbong1750437627382 implements MigrationInterface {
    name = 'AddDaBiDisableToSanbong1750437627382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`SANBONG\` ADD \`daBiDisable\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`SANBONG\` DROP COLUMN \`daBiDisable\``);
    }

}
