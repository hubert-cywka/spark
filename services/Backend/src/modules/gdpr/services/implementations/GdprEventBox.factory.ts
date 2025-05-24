import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IEventBoxFactory } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { GDPR_MODULE_DATA_SOURCE } from "@/modules/gdpr/infrastructure/database/constants";

@Injectable()
export class GdprEventBoxFactory implements IEventBoxFactory {
    public constructor(
        @InjectRepository(InboxEventEntity, GDPR_MODULE_DATA_SOURCE)
        private readonly inboxRepository: Repository<InboxEventEntity>,
        @InjectRepository(OutboxEventEntity, GDPR_MODULE_DATA_SOURCE)
        private readonly outboxRepository: Repository<OutboxEventEntity>
    ) {}

    public createOutboxOptions(context: string) {
        return {
            context,
            repository: this.outboxRepository,
            connectionName: GDPR_MODULE_DATA_SOURCE,
        };
    }

    public createInboxOptions(context: string) {
        return {
            context,
            repository: this.inboxRepository,
            connectionName: GDPR_MODULE_DATA_SOURCE,
        };
    }
}
