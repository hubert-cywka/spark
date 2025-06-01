import { Entity, ManyToOne, PrimaryColumn } from "typeorm";

import { IntegrationEventPartitionEntity } from "@/common/events/entities/IntegrationEventPartition.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";

@Entity("outbox_event_partition")
export class OutboxEventPartitionEntity extends IntegrationEventPartitionEntity {
    @ManyToOne(() => OutboxEventEntity, (event) => event.partition)
    @PrimaryColumn({ type: "int" })
    id!: number;
}
