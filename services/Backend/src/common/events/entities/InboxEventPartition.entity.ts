import { Entity, Index } from "typeorm";

import { IntegrationEventPartitionEntity } from "@/common/events/entities/IntegrationEventPartition.entity";

@Entity("inbox_event_partition")
@Index("idx_inbox_partitions_to_process", ["lastProcessedAt", "staleAt"])
export class InboxEventPartitionEntity extends IntegrationEventPartitionEntity {}
