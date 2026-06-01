import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMoTaNullableYeucauruttien1750173302255 implements MigrationInterface {
    name = 'UpdateMoTaNullableYeucauruttien1750173302255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`YEUCAURUTTIEN\` CHANGE \`moTa\` \`moTa\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`YEUCAURUTTIEN\` CHANGE \`moTa\` \`moTa\` varchar(255) NOT NULL`);
    }

}
