import { Entity, Index } from "typeorm";

import { IntegrationEventPartitionEntity } from "@/common/events/entities/IntegrationEventPartition.entity";

@Entity("outbox_event_partition")
@Index("idx_outbox_partitions_to_process", ["lastProcessedAt", "staleAt"])
export class OutboxEventPartitionEntity extends IntegrationEventPartitionEntity {}
