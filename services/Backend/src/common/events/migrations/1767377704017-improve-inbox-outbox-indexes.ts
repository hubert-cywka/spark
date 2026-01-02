import { MigrationInterface, QueryRunner } from "typeorm";

export class ImproveInboxOutboxIndexes1767377704017 implements MigrationInterface {
    name = "ImproveInboxOutboxIndexes1767377704017";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_inbox_events_blocked"');
        await queryRunner.query('DROP INDEX "public"."idx_inbox_events_for_processing"');
        await queryRunner.query('DROP INDEX "public"."idx_outbox_events_for_processing"');
        await queryRunner.query('CREATE INDEX "idx_inbox_cleanup" ON "inbox_event" ("processedAt") ');
        await queryRunner.query(
            'CREATE INDEX "idx_inbox_blocked_lookup" ON "inbox_event" ("partition", "processAfter", "attempts") WHERE "processedAt" IS NULL'
        );
        await queryRunner.query(
            'CREATE INDEX "idx_inbox_for_processing" ON "inbox_event" ("partition", "processAfter", "sequence") WHERE "processedAt" IS NULL'
        );
        await queryRunner.query('CREATE INDEX "idx_outbox_cleanup" ON "outbox_event" ("processedAt") ');
        await queryRunner.query(
            'CREATE INDEX "idx_outbox_events_for_processing" ON "outbox_event" ("partition", "attempts", "sequence") WHERE "processedAt" IS NULL'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_outbox_events_for_processing"');
        await queryRunner.query('DROP INDEX "public"."idx_outbox_cleanup"');
        await queryRunner.query('DROP INDEX "public"."idx_inbox_for_processing"');
        await queryRunner.query('DROP INDEX "public"."idx_inbox_blocked_lookup"');
        await queryRunner.query('DROP INDEX "public"."idx_inbox_cleanup"');
        await queryRunner.query(
            'CREATE INDEX "idx_outbox_events_for_processing" ON "outbox_event" ("attempts", "createdAt", "partition", "processedAt") '
        );
        await queryRunner.query(
            'CREATE INDEX "idx_inbox_events_for_processing" ON "inbox_event" ("createdAt", "partition", "processedAt") '
        );
        await queryRunner.query(
            'CREATE INDEX "idx_inbox_events_blocked" ON "inbox_event" ("attempts", "partition", "processAfter", "processedAt") '
        );
    }
}
