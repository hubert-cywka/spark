import { Column, Entity } from "typeorm";

import { IntegrationEventEntity } from "@/common/events/entities/IntegrationEvent.entity";

@Entity("inbox_event")
export class InboxEventEntity<T = unknown> extends IntegrationEventEntity<T> {
    @Column({ type: "timestamptz" })
    receivedAt!: Date;

    @Column({ type: "timestamptz" })
    processAfter!: Date;
}
