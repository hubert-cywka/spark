import { Column, Entity, Index } from "typeorm";

import { IntegrationEventEntity } from "@/common/events/entities/IntegrationEvent.entity";

@Entity("inbox_event")
@Index("idx_inbox_events_for_processing", ["partition", "processedAt", "createdAt"])
@Index("idx_inbox_events_blocked", ["partition", "processedAt", "processAfter", "attempts"])
export class InboxEventEntity<T = string | object> extends IntegrationEventEntity<T> {
    @Column({ type: "timestamptz" })
    receivedAt!: Date;

    @Column({ type: "timestamptz" })
    processAfter!: Date;
}
