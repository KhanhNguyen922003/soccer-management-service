import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteToMediaSanbongchitiet1748068086507 implements MigrationInterface {
    name = 'AddCascadeDeleteToMediaSanbongchitiet1748068086507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONGCHITIET\` DROP FOREIGN KEY \`FK_85a71fbdd17fe86d0564276a6d8\``);
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONGCHITIET\` ADD CONSTRAINT \`FK_85a71fbdd17fe86d0564276a6d8\` FOREIGN KEY (\`maSanBongChiTiet\`) REFERENCES \`SANBONGCHITIET\`(\`maSanChiTiet\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONGCHITIET\` DROP FOREIGN KEY \`FK_85a71fbdd17fe86d0564276a6d8\``);
        await queryRunner.query(`ALTER TABLE \`MEDIA_SANBONGCHITIET\` ADD CONSTRAINT \`FK_85a71fbdd17fe86d0564276a6d8\` FOREIGN KEY (\`maSanBongChiTiet\`) REFERENCES \`SANBONGCHITIET\`(\`maSanChiTiet\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
