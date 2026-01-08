import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestampsPrecisionOutbox1767887939996 implements MigrationInterface {
    name = "TimestampsPrecisionOutbox1767887939996";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_inbox_blocked_lookup"');
        await queryRunner.query('DROP INDEX "public"."idx_inbox_for_processing"');
        await queryRunner.query('ALTER TABLE "inbox_event" ALTER COLUMN "createdAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "inbox_event" ALTER COLUMN "receivedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "inbox_event" ALTER COLUMN "processAfter" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('DROP INDEX "public"."idx_inbox_partitions_to_process"');
        await queryRunner.query('ALTER TABLE "inbox_event_partition" ALTER COLUMN "staleAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "outbox_event" ALTER COLUMN "createdAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('DROP INDEX "public"."idx_outbox_partitions_to_process"');
        await queryRunner.query('ALTER TABLE "outbox_event_partition" ALTER COLUMN "staleAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query(
            'CREATE INDEX "idx_inbox_blocked_lookup" ON "inbox_event" ("partition", "processAfter", "attempts") WHERE "processedAt" IS NULL'
        );
        await queryRunner.query(
            'CREATE INDEX "idx_inbox_for_processing" ON "inbox_event" ("partition", "processAfter", "sequence") WHERE "processedAt" IS NULL'
        );
        await queryRunner.query(
            'CREATE INDEX "idx_inbox_partitions_to_process" ON "inbox_event_partition" ("lastProcessedAt", "staleAt") '
        );
        await queryRunner.query(
            'CREATE INDEX "idx_outbox_partitions_to_process" ON "outbox_event_partition" ("lastProcessedAt", "staleAt") '
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_outbox_partitions_to_process"');
        await queryRunner.query('DROP INDEX "public"."idx_inbox_partitions_to_process"');
        await queryRunner.query('DROP INDEX "public"."idx_inbox_for_processing"');
        await queryRunner.query('DROP INDEX "public"."idx_inbox_blocked_lookup"');
        await queryRunner.query('ALTER TABLE "outbox_event_partition" ALTER COLUMN "staleAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query(
            'CREATE INDEX "idx_outbox_partitions_to_process" ON "outbox_event_partition" ("lastProcessedAt", "staleAt") '
        );
        await queryRunner.query('ALTER TABLE "outbox_event" ALTER COLUMN "createdAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "inbox_event_partition" ALTER COLUMN "staleAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query(
            'CREATE INDEX "idx_inbox_partitions_to_process" ON "inbox_event_partition" ("lastProcessedAt", "staleAt") '
        );
        await queryRunner.query('ALTER TABLE "inbox_event" ALTER COLUMN "processAfter" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "inbox_event" ALTER COLUMN "receivedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "inbox_event" ALTER COLUMN "createdAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query(
            'CREATE INDEX "idx_inbox_for_processing" ON "inbox_event" ("partition", "processAfter", "sequence") WHERE ("processedAt" IS NULL)'
        );
        await queryRunner.query(
            'CREATE INDEX "idx_inbox_blocked_lookup" ON "inbox_event" ("attempts", "partition", "processAfter") WHERE ("processedAt" IS NULL)'
        );
    }
}
