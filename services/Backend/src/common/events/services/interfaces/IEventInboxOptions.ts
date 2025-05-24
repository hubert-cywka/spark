import { Repository } from "typeorm";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";

export const EventInboxOptionsToken = Symbol("EventInboxOptions");

export interface IEventInboxOptions {
    repository: Repository<InboxEventEntity>;
    connectionName: string;
    context: string;
}
