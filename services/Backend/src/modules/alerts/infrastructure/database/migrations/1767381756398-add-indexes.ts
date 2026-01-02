import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1767381756398 implements MigrationInterface {
    name = "AddIndexes1767381756398";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE INDEX "idx_alert_triggering" ON "alert" ("nextTriggerAt", "enabled") WHERE "nextTriggerAt" IS NOT NULL AND "deletedAt" IS NULL'
        );
        await queryRunner.query('CREATE INDEX "idx_alert_recipient_lookup" ON "alert" ("recipientId", "createdAt") ');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_alert_recipient_lookup"');
        await queryRunner.query('DROP INDEX "public"."idx_alert_triggering"');
    }
}
