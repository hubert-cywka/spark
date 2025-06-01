import { Entity, PrimaryColumn } from "typeorm";

import { IntegrationEventPartitionEntity } from "@/common/events/entities/IntegrationEventPartition.entity";

@Entity("outbox_event_partition")
export class OutboxEventPartitionEntity extends IntegrationEventPartitionEntity {
    @PrimaryColumn({ type: "int" })
    id!: number;
}
