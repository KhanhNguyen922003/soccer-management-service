import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateChiTietDatSanRelation1748405203438 implements MigrationInterface {
    name = 'UpdateChiTietDatSanRelation1748405203438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` DROP FOREIGN KEY \`FK_4425ce3863183b11dd842002d69\``);
        await queryRunner.query(`ALTER TABLE \`DATSAN\` ADD \`soTien\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` ADD CONSTRAINT \`FK_4425ce3863183b11dd842002d69\` FOREIGN KEY (\`maSanChiTiet\`) REFERENCES \`SANBONGCHITIET\`(\`maSanChiTiet\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` DROP FOREIGN KEY \`FK_4425ce3863183b11dd842002d69\``);
        await queryRunner.query(`ALTER TABLE \`DATSAN\` DROP COLUMN \`soTien\``);
        await queryRunner.query(`ALTER TABLE \`CHITIETDATSAN\` ADD CONSTRAINT \`FK_4425ce3863183b11dd842002d69\` FOREIGN KEY (\`maSanChiTiet\`) REFERENCES \`SANBONG\`(\`maSanBong\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
