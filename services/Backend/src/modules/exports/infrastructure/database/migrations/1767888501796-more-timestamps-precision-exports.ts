import { MigrationInterface, QueryRunner } from "typeorm";

export class MoreTimestampsPrecisionExports1767888501796 implements MigrationInterface {
    name = "MoreTimestampsPrecisionExports1767888501796";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "data_export" ALTER COLUMN "cancelledAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "data_export" ALTER COLUMN "completedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "data_export" ALTER COLUMN "completedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "data_export" ALTER COLUMN "cancelledAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
    }
}
