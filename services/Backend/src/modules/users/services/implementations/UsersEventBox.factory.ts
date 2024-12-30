import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

import { EventOutbox, IEventBoxFactory } from "@/common/events";
import { IntegrationEventsClientProxyToken } from "@/common/events/IntegrationEvents.module";
import { EventInbox } from "@/common/events/services/implementations/EventInbox";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants";

@Injectable()
export class UsersEventBoxFactory implements IEventBoxFactory {
    public constructor(
        @Inject(IntegrationEventsClientProxyToken)
        private readonly clientProxy: ClientProxy,
        @InjectTransactionHost(USERS_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>
    ) {}

    public createOutbox(context?: string) {
        return new EventOutbox(this.clientProxy, this.txHost, context);
    }

    public createInbox(context?: string) {
        return new EventInbox(this.txHost, context);
    }
}
