import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestampsPrecisionAlerts1767888108814 implements MigrationInterface {
    name = "TimestampsPrecisionAlerts1767888108814";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "recipient" ALTER COLUMN "createdAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "recipient" ALTER COLUMN "updatedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('DROP INDEX "public"."idx_alert_recipient_lookup"');
        await queryRunner.query('ALTER TABLE "alert" ALTER COLUMN "createdAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "alert" ALTER COLUMN "updatedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('CREATE INDEX "idx_alert_recipient_lookup" ON "alert" ("recipientId", "createdAt") ');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_alert_recipient_lookup"');
        await queryRunner.query('ALTER TABLE "alert" ALTER COLUMN "updatedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "alert" ALTER COLUMN "createdAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('CREATE INDEX "idx_alert_recipient_lookup" ON "alert" ("createdAt", "recipientId") ');
        await queryRunner.query('ALTER TABLE "recipient" ALTER COLUMN "updatedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "recipient" ALTER COLUMN "createdAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
    }
}
