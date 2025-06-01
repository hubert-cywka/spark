import { Entity, ManyToOne, PrimaryColumn } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { IntegrationEventPartitionEntity } from "@/common/events/entities/IntegrationEventPartition.entity";

@Entity("inbox_event_partition")
export class InboxEventPartitionEntity extends IntegrationEventPartitionEntity {
    @ManyToOne(() => InboxEventEntity, (event) => event.partition)
    @PrimaryColumn({ type: "int" })
    id!: number;
}
