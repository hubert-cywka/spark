import { MigrationInterface, QueryRunner } from "typeorm";

export class FixAlertEntity1737494837758 implements MigrationInterface {
    name = "FixAlertEntity1737494837758";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "alert" RENAME COLUMN "condition" TO "enabled"');
        await queryRunner.query('ALTER TABLE "alert" DROP COLUMN "enabled"');
        await queryRunner.query('ALTER TABLE "alert" ADD "enabled" boolean NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "alert" DROP COLUMN "enabled"');
        await queryRunner.query('ALTER TABLE "alert" ADD "enabled" text NOT NULL');
        await queryRunner.query('ALTER TABLE "alert" RENAME COLUMN "enabled" TO "condition"');
    }
}
