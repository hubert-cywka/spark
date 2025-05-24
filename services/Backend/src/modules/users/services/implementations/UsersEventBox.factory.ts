import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IEventBoxFactory } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants";

@Injectable()
export class UsersEventBoxFactory implements IEventBoxFactory {
    public constructor(
        @InjectRepository(InboxEventEntity, USERS_MODULE_DATA_SOURCE)
        private readonly inboxRepository: Repository<InboxEventEntity>,
        @InjectRepository(OutboxEventEntity, USERS_MODULE_DATA_SOURCE)
        private readonly outboxRepository: Repository<OutboxEventEntity>
    ) {}

    public createOutboxOptions(context: string) {
        return {
            context,
            repository: this.outboxRepository,
            connectionName: USERS_MODULE_DATA_SOURCE,
        };
    }

    public createInboxOptions(context: string) {
        return {
            context,
            repository: this.inboxRepository,
            connectionName: USERS_MODULE_DATA_SOURCE,
        };
    }
}
