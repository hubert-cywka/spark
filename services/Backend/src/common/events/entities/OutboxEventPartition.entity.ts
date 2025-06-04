import { Entity, Index } from "typeorm";

import { IntegrationEventPartitionEntity } from "@/common/events/entities/IntegrationEventPartition.entity";

@Entity("outbox_event_partition")
@Index("idx_outbox_partitions_by_last_processed_at", ["lastProcessedAt"])
export class OutboxEventPartitionEntity extends IntegrationEventPartitionEntity {}
