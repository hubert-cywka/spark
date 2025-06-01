import { Entity, Index } from "typeorm";

import { IntegrationEventEntity } from "@/common/events/entities/IntegrationEvent.entity";

@Entity("outbox_event")
@Index("idx_outbox_events_for_processing", ["partition", "processedAt", "attempts", "createdAt"])
export class OutboxEventEntity<T = unknown> extends IntegrationEventEntity<T> {}
