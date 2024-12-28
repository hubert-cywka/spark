import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

import { Outbox, OutboxFactory } from "@/common/events";
import { IntegrationEventsClientProxyToken } from "@/common/events/IntegrationEvents.module";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants/connectionName";

@Injectable()
export class UsersOutboxFactory implements OutboxFactory {
    public constructor(
        @Inject(IntegrationEventsClientProxyToken)
        private readonly clientProxy: ClientProxy,
        @InjectTransactionHost(USERS_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>
    ) {}

    public create(context?: string) {
        return new Outbox(this.clientProxy, this.txHost, context);
    }
}
