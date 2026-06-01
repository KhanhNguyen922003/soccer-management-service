import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNguoiDungTable1744994643460 implements MigrationInterface {
    name = 'CreateNguoiDungTable1744994643460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`NGUOIDUNG\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`maNguoiDung\` varchar(36) NOT NULL, \`hoTen\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`soDienThoai\` varchar(255) NOT NULL, \`matKhau\` varchar(255) NOT NULL, \`vaiTro\` enum ('admin', 'nguoiThue', 'chuSan') NOT NULL DEFAULT 'nguoiThue', \`soDuTaiKhoan\` decimal NOT NULL DEFAULT '0', UNIQUE INDEX \`IDX_6a6d29b01e39935d2e444b3e2d\` (\`email\`), PRIMARY KEY (\`maNguoiDung\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_6a6d29b01e39935d2e444b3e2d\` ON \`NGUOIDUNG\``);
        await queryRunner.query(`DROP TABLE \`NGUOIDUNG\``);
    }

}
