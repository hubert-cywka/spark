import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordResetToken1728063790547 implements MigrationInterface {
    name = "AddPasswordResetToken1728063790547";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" ADD "passwordResetToken" character varying');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "passwordResetToken"');
    }
}
