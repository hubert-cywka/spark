import { Entity } from "typeorm";

import { IntegrationEventPartitionEntity } from "@/common/events/entities/IntegrationEventPartition.entity";

// TODO: Indexes
@Entity("inbox_event_partition")
export class InboxEventPartitionEntity extends IntegrationEventPartitionEntity {}
