import { Column, Entity, Index } from "typeorm";

import { IntegrationEventEntity } from "@/common/events/entities/IntegrationEvent.entity";

@Entity("inbox_event")
@Index("idx_inbox_for_processing", ["partition", "processAfter", "sequence"], { where: '"processedAt" IS NULL' })
@Index("idx_inbox_blocked_lookup", ["partition", "processAfter", "attempts"], { where: '"processedAt" IS NULL' })
@Index("idx_inbox_cleanup", ["processedAt"])
export class InboxEventEntity<T = string | object> extends IntegrationEventEntity<T> {
    @Column({ type: "timestamptz" })
    receivedAt!: Date;

    @Column({ type: "timestamptz" })
    processAfter!: Date;
}
