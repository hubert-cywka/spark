import { Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { NatsJetStreamClientProxy } from "@nestjs-plugins/nestjs-nats-jetstream-transport";

import { EventOutbox, IEventBoxFactory } from "@/common/events";
import { EventInbox } from "@/common/events/services/implementations/EventInbox";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/constants";

@Injectable()
export class JournalEventBoxFactory implements IEventBoxFactory {
    public constructor(
        private readonly clientProxy: NatsJetStreamClientProxy,
        @InjectTransactionHost(JOURNAL_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>
    ) {}

    public createOutbox(context?: string) {
        return new EventOutbox(this.clientProxy, this.txHost, context);
    }

    public createInbox(context?: string) {
        return new EventInbox(this.txHost, context);
    }
}
