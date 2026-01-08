import { MigrationInterface, QueryRunner } from "typeorm";

export class MoreTimestampsPrecisionOutbox1767888332310 implements MigrationInterface {
    name = "MoreTimestampsPrecisionOutbox1767888332310";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "inbox_event" ALTER COLUMN "processedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('DROP INDEX "public"."idx_inbox_partitions_to_process"');
        await queryRunner.query('ALTER TABLE "inbox_event_partition" ALTER COLUMN "lastProcessedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "outbox_event" ALTER COLUMN "processedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
        await queryRunner.query('DROP INDEX "public"."idx_outbox_partitions_to_process"');
        await queryRunner.query('ALTER TABLE "outbox_event_partition" ALTER COLUMN "lastProcessedAt" TYPE TIMESTAMP(3) WITH TIME ZONE');
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
        await queryRunner.query('ALTER TABLE "outbox_event_partition" ALTER COLUMN "lastProcessedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query(
            'CREATE INDEX "idx_outbox_partitions_to_process" ON "outbox_event_partition" ("lastProcessedAt", "staleAt") '
        );
        await queryRunner.query('ALTER TABLE "outbox_event" ALTER COLUMN "processedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query('ALTER TABLE "inbox_event_partition" ALTER COLUMN "lastProcessedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
        await queryRunner.query(
            'CREATE INDEX "idx_inbox_partitions_to_process" ON "inbox_event_partition" ("lastProcessedAt", "staleAt") '
        );
        await queryRunner.query('ALTER TABLE "inbox_event" ALTER COLUMN "processedAt" TYPE TIMESTAMP(6) WITH TIME ZONE');
    }
}
