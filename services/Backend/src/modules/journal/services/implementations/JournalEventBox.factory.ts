import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IEventBoxFactory } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";

@Injectable()
export class JournalEventBoxFactory implements IEventBoxFactory {
    public constructor(
        @InjectRepository(InboxEventEntity, JOURNAL_MODULE_DATA_SOURCE)
        private readonly inboxRepository: Repository<InboxEventEntity>,
        @InjectRepository(OutboxEventEntity, JOURNAL_MODULE_DATA_SOURCE)
        private readonly outboxRepository: Repository<OutboxEventEntity>
    ) {}

    public createOutboxOptions(context: string) {
        return {
            context,
            repository: this.outboxRepository,
            connectionName: JOURNAL_MODULE_DATA_SOURCE,
        };
    }

    public createInboxOptions(context: string) {
        return {
            context,
            repository: this.inboxRepository,
            connectionName: JOURNAL_MODULE_DATA_SOURCE,
        };
    }
}
