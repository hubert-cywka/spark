import { MigrationInterface, QueryRunner } from "typeorm";

export class MoreTimestampsPrecisionAlerts1767888489727 implements MigrationInterface {
    name = "MoreTimestampsPrecisionAlerts1767888489727";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_alert_triggering"');
        await queryRunner.query('ALTER TABLE "alert" ALTER COLUMN "nextTriggerAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "alert" ALTER COLUMN "deletedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query(
            'CREATE INDEX "idx_alert_triggering" ON "alert" ("nextTriggerAt", "enabled") WHERE "nextTriggerAt" IS NOT NULL AND "deletedAt" IS NULL'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_alert_triggering"');
        await queryRunner.query('ALTER TABLE "alert" ALTER COLUMN "deletedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "alert" ALTER COLUMN "nextTriggerAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query(
            'CREATE INDEX "idx_alert_triggering" ON "alert" ("enabled", "nextTriggerAt") WHERE (("nextTriggerAt" IS NOT NULL) AND ("deletedAt" IS NULL))'
        );
    }
}
