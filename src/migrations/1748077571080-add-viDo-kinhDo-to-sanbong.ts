import { MigrationInterface, QueryRunner } from "typeorm";

export class AddViDoKinhDoToSanbong1748077571080 implements MigrationInterface {
    name = 'AddViDoKinhDoToSanbong1748077571080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "SANBONG" ADD "viDo" double precision NULL`);
        await queryRunner.query(`ALTER TABLE "SANBONG" ADD "kinhDo" double precision NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "SANBONG" DROP COLUMN "kinhDo"`);
        await queryRunner.query(`ALTER TABLE "SANBONG" DROP COLUMN "viDo"`);
    }

}
