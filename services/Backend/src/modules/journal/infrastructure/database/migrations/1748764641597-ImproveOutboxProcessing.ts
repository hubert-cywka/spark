import { MigrationInterface, QueryRunner } from "typeorm";

import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";
import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";

export class ImproveOutboxProcessing1748764641597 implements MigrationInterface {
    name = "ImproveOutboxProcessing1748764641597";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "inbox_event_partition" ("lastProcessedAt" TIMESTAMP WITH TIME ZONE, "id" integer NOT NULL, "idId" uuid, CONSTRAINT "PK_e88e03060a872c8c20dff84f970" PRIMARY KEY ("id"))'
        );
        await queryRunner.query(
            'CREATE TABLE "outbox_event_partition" ("lastProcessedAt" TIMESTAMP WITH TIME ZONE, "id" integer NOT NULL, "idId" uuid, CONSTRAINT "PK_3bbbc63b3bbf3a5bb0034fea263" PRIMARY KEY ("id"))'
        );
        await queryRunner.query('ALTER TABLE "inbox_event" ADD "partitionKey" character varying NOT NULL');
        await queryRunner.query('ALTER TABLE "inbox_event" ADD "partition" integer NOT NULL');
        await queryRunner.query('ALTER TABLE "outbox_event" ADD "partitionKey" character varying NOT NULL');
        await queryRunner.query('ALTER TABLE "outbox_event" ADD "partition" integer NOT NULL');
        await queryRunner.query(
            'ALTER TABLE "inbox_event_partition" ADD CONSTRAINT "FK_09d98ae5bd8beaff320d900bfbe" FOREIGN KEY ("idId") REFERENCES "inbox_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "outbox_event_partition" ADD CONSTRAINT "FK_aaa8535e9696603e270a85f5165" FOREIGN KEY ("idId") REFERENCES "outbox_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );

        const outboxPartitionRepository = queryRunner.manager.getRepository(OutboxEventPartitionEntity);
        const outboxPartitionsToInsert: OutboxEventPartitionEntity[] = [];

        const inboxPartitionRepository = queryRunner.manager.getRepository(InboxEventPartitionEntity);
        const inboxPartitionsToInsert: InboxEventPartitionEntity[] = [];

        const initialNumberOfPartitions = 16;

        for (let i = 1; i <= initialNumberOfPartitions; i++) {
            outboxPartitionsToInsert.push({ id: i, lastProcessedAt: null });
            inboxPartitionsToInsert.push({ id: i, lastProcessedAt: null });
        }

        await outboxPartitionRepository.insert(outboxPartitionsToInsert);
        await inboxPartitionRepository.insert(inboxPartitionsToInsert);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "outbox_event_partition" DROP CONSTRAINT "FK_aaa8535e9696603e270a85f5165"');
        await queryRunner.query('ALTER TABLE "inbox_event_partition" DROP CONSTRAINT "FK_09d98ae5bd8beaff320d900bfbe"');
        await queryRunner.query('ALTER TABLE "outbox_event" DROP COLUMN "partition"');
        await queryRunner.query('ALTER TABLE "outbox_event" DROP COLUMN "partitionKey"');
        await queryRunner.query('ALTER TABLE "inbox_event" DROP COLUMN "partition"');
        await queryRunner.query('ALTER TABLE "inbox_event" DROP COLUMN "partitionKey"');
        await queryRunner.query('DROP TABLE "outbox_event_partition"');
        await queryRunner.query('DROP TABLE "inbox_event_partition"');
    }
}
