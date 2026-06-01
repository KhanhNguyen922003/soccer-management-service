import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBaoCaoEntity1750352085571 implements MigrationInterface {
    name = 'AddBaoCaoEntity1750352085571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`BAOCAO\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`maBaoCao\` varchar(36) NOT NULL, \`lyDo\` varchar(255) NOT NULL, \`thoiGianBaoCao\` datetime NOT NULL, \`nguoiThue\` varchar(36) NULL, \`maSanBong\` varchar(36) NULL, PRIMARY KEY (\`maBaoCao\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`BAOCAO\` ADD CONSTRAINT \`FK_c16acfb783e1ba1db276bbfef49\` FOREIGN KEY (\`nguoiThue\`) REFERENCES \`NGUOIDUNG\`(\`maNguoiDung\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`BAOCAO\` ADD CONSTRAINT \`FK_344c9ea1dd49f612f18e2a6802c\` FOREIGN KEY (\`maSanBong\`) REFERENCES \`SANBONG\`(\`maSanBong\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`BAOCAO\` DROP FOREIGN KEY \`FK_344c9ea1dd49f612f18e2a6802c\``);
        await queryRunner.query(`ALTER TABLE \`BAOCAO\` DROP FOREIGN KEY \`FK_c16acfb783e1ba1db276bbfef49\``);
        await queryRunner.query(`DROP TABLE \`BAOCAO\``);
    }

}
