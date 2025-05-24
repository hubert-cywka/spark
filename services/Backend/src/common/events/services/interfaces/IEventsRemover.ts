import { Repository } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";

export const EventsRemoverToken = Symbol("EventsRemover");

export interface IEventsRemover {
    removeProcessedBefore(processedBefore: Date, repository: Repository<OutboxEventEntity | InboxEventEntity>): Promise<void>;
    removeByTenant(tenantId: string, repository: Repository<OutboxEventEntity | InboxEventEntity>): Promise<void>;
}
