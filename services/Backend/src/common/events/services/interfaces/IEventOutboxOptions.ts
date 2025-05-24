import { Repository } from "typeorm";

import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";

export const EventOutboxOptionsToken = Symbol("EventOutboxOptions");

export interface IEventOutboxOptions {
    repository: Repository<OutboxEventEntity>;
    connectionName: string;
    context: string;
}
