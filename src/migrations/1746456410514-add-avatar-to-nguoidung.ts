import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarToNguoidung1746456410514 implements MigrationInterface {
    name = 'AddAvatarToNguoidung1746456410514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`NGUOIDUNG\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`NGUOIDUNG\` DROP COLUMN \`avatar\``);
    }

}
