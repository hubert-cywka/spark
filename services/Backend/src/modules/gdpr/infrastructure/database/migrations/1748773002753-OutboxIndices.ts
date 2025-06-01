import { MigrationInterface, QueryRunner } from "typeorm";

export class OutboxIndices1748773002753 implements MigrationInterface {
    name = "OutboxIndices1748773002753";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE INDEX "idx_outbox_events_for_processing" ON "outbox_event" ("partition", "processedAt", "attempts", "createdAt") '
        );
        await queryRunner.query(
            'CREATE INDEX "idx_outbox_partitions_by_last_processed_at" ON "outbox_event_partition" ("lastProcessedAt") '
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_outbox_partitions_by_last_processed_at"');
        await queryRunner.query('DROP INDEX "public"."idx_outbox_events_for_processing"');
    }
}
