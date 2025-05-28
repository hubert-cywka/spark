import { Entity } from "typeorm";

import { IntegrationEventEntity } from "@/common/events/entities/IntegrationEvent.entity";

@Entity("outbox_event")
export class OutboxEventEntity<T = unknown> extends IntegrationEventEntity<T> {}
