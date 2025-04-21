import { Inject, Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

import { EventOutbox, IEventBoxFactory } from "@/common/events";
import { EventInbox } from "@/common/events/services/implementations/EventInbox";
import { type IPubSubClient, PubSubClientToken } from "@/common/events/services/interfaces/IPubSubClient";
import { ALERTS_MODULE_DATA_SOURCE } from "@/modules/alerts/infrastructure/database/constants";

@Injectable()
export class AlertsEventBoxFactory implements IEventBoxFactory {
    public constructor(
        @Inject(PubSubClientToken)
        private readonly clientProxy: IPubSubClient,
        @InjectTransactionHost(ALERTS_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>
    ) {}

    public createOutbox(context?: string) {
        return new EventOutbox(this.clientProxy, this.txHost, context);
    }

    public createInbox(context?: string) {
        return new EventInbox(this.txHost, context);
    }
}
