import { MigrationInterface, QueryRunner } from "typeorm";

import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";
import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";

export class InboxAndOutbox1749299050551 implements MigrationInterface {
    name = "InboxAndOutbox1749299050551";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "inbox_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenantId" uuid NOT NULL, "partitionKey" character varying NOT NULL, "partition" integer NOT NULL, "topic" character varying NOT NULL, "isEncrypted" boolean NOT NULL DEFAULT false, "payload" jsonb NOT NULL, "attempts" integer NOT NULL DEFAULT \'0\', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "processedAt" TIMESTAMP WITH TIME ZONE, "receivedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "processAfter" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_9b85eb4cab41c7c6023b1e579d0" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE INDEX "idx_inbox_events_blocked" ON "inbox_event" ("partition", "processedAt", "processAfter", "attempts") '
        );
        await queryRunner.query(
            'CREATE INDEX "idx_inbox_events_for_processing" ON "inbox_event" ("partition", "processedAt", "createdAt") '
        );
        await queryRunner.query(
            'CREATE TABLE "inbox_event_partition" ("id" integer NOT NULL, "staleAt" TIMESTAMP WITH TIME ZONE NOT NULL, "lastProcessedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_e88e03060a872c8c20dff84f970" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE INDEX "idx_inbox_partitions_to_process" ON "inbox_event_partition" ("lastProcessedAt", "staleAt") '
        );
        await queryRunner.query(
            'CREATE TABLE "outbox_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenantId" uuid NOT NULL, "partitionKey" character varying NOT NULL, "partition" integer NOT NULL, "topic" character varying NOT NULL, "isEncrypted" boolean NOT NULL DEFAULT false, "payload" jsonb NOT NULL, "attempts" integer NOT NULL DEFAULT \'0\', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "processedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_cc0c9e40998e45ecfc5e313429d" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE INDEX "idx_outbox_events_for_processing" ON "outbox_event" ("partition", "processedAt", "attempts", "createdAt") '
        );
        await queryRunner.query(
            'CREATE TABLE "outbox_event_partition" ("id" integer NOT NULL, "staleAt" TIMESTAMP WITH TIME ZONE NOT NULL, "lastProcessedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_3bbbc63b3bbf3a5bb0034fea263" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE INDEX "idx_outbox_partitions_to_process" ON "outbox_event_partition" ("lastProcessedAt", "staleAt") '
        );

        const outboxPartitionRepository = queryRunner.manager.getRepository(OutboxEventPartitionEntity);
        const outboxPartitionsToInsert: OutboxEventPartitionEntity[] = [];

        const inboxPartitionRepository = queryRunner.manager.getRepository(InboxEventPartitionEntity);
        const inboxPartitionsToInsert: InboxEventPartitionEntity[] = [];

        const initialNumberOfPartitions = 16;

        for (let i = 1; i <= initialNumberOfPartitions; i++) {
            outboxPartitionsToInsert.push({
                id: i,
                lastProcessedAt: null,
                staleAt: new Date(),
            });
            inboxPartitionsToInsert.push({
                id: i,
                lastProcessedAt: null,
                staleAt: new Date(),
            });
        }

        await outboxPartitionRepository.insert(outboxPartitionsToInsert);
        await inboxPartitionRepository.insert(inboxPartitionsToInsert);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "public"."idx_outbox_partitions_to_process"');
        await queryRunner.query('DROP TABLE "outbox_event_partition"');
        await queryRunner.query('DROP INDEX "public"."idx_outbox_events_for_processing"');
        await queryRunner.query('DROP TABLE "outbox_event"');
        await queryRunner.query('DROP INDEX "public"."idx_inbox_partitions_to_process"');
        await queryRunner.query('DROP TABLE "inbox_event_partition"');
        await queryRunner.query('DROP INDEX "public"."idx_inbox_events_for_processing"');
        await queryRunner.query('DROP INDEX "public"."idx_inbox_events_blocked"');
        await queryRunner.query('DROP TABLE "inbox_event"');
    }
}
