import { Entity, Index } from "typeorm";

import { IntegrationEventEntity } from "@/common/events/entities/IntegrationEvent.entity";

@Entity("outbox_event")
@Index("idx_outbox_events_for_processing", ["partition", "attempts", "sequence"], { where: '"processedAt" IS NULL' })
@Index("idx_outbox_cleanup", ["processedAt"])
export class OutboxEventEntity<T = string | object> extends IntegrationEventEntity<T> {}
