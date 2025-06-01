import { Entity, PrimaryColumn } from "typeorm";

import { IntegrationEventPartitionEntity } from "@/common/events/entities/IntegrationEventPartition.entity";

@Entity("inbox_event_partition")
export class InboxEventPartitionEntity extends IntegrationEventPartitionEntity {
    @PrimaryColumn({ type: "int" })
    id!: number;
}
