import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateHinhAnhNullable1747559380031 implements MigrationInterface {
    name = 'UpdateHinhAnhNullable1747559380031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`SANBONG\` CHANGE \`hinhAnh\` \`hinhAnh\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`SANBONG\` CHANGE \`hinhAnh\` \`hinhAnh\` varchar(255) NOT NULL`);
    }

}
