import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSanBongAndMediaSanBong1747556314771 implements MigrationInterface {
    name = 'UpdateSanBongAndMediaSanBong1747556314771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONG\` DROP FOREIGN KEY \`FK_6cb8ba424f2b4c99bd19f42688b\``);
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONG\` ADD CONSTRAINT \`FK_6cb8ba424f2b4c99bd19f42688b\` FOREIGN KEY (\`maSanBong\`) REFERENCES \`SANBONG\`(\`maSanBong\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONG\` DROP FOREIGN KEY \`FK_6cb8ba424f2b4c99bd19f42688b\``);
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONG\` ADD CONSTRAINT \`FK_6cb8ba424f2b4c99bd19f42688b\` FOREIGN KEY (\`maSanBong\`) REFERENCES \`SANBONG\`(\`maSanBong\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
