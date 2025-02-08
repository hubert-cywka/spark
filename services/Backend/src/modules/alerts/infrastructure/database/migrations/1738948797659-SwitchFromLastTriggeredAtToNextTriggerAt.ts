import { MigrationInterface, QueryRunner } from "typeorm";

export class SwitchFromLastTriggeredAtToNextTriggerAt1738948797659 implements MigrationInterface {
    name = "SwitchFromLastTriggeredAtToNextTriggerAt1738948797659";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "alert" DROP COLUMN "lastTriggeredAt"');
        await queryRunner.query('ALTER TABLE "alert" ADD "nextTriggerAt" TIMESTAMP WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "alert" DROP COLUMN "daysOfWeek"');
        await queryRunner.query('ALTER TABLE "alert" ADD "daysOfWeek" integer array NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "alert" DROP COLUMN "daysOfWeek"');
        await queryRunner.query('ALTER TABLE "alert" ADD "daysOfWeek" text array NOT NULL');
        await queryRunner.query('ALTER TABLE "alert" DROP COLUMN "nextTriggerAt"');
        await queryRunner.query('ALTER TABLE "alert" ADD "lastTriggeredAt" TIMESTAMP WITH TIME ZONE');
    }
}
