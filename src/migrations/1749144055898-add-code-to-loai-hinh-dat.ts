import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCodeToLoaiHinhDat1749144055898 implements MigrationInterface {
    name = 'AddCodeToLoaiHinhDat1749144055898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`LOAIHINHDAT\` ADD \`code\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`LOAIHINHDAT\` ADD UNIQUE INDEX \`IDX_5da1c60efd282a49c84dbfd3f5\` (\`code\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`LOAIHINHDAT\` DROP INDEX \`IDX_5da1c60efd282a49c84dbfd3f5\``);
        await queryRunner.query(`ALTER TABLE \`LOAIHINHDAT\` DROP COLUMN \`code\``);
    }

}
