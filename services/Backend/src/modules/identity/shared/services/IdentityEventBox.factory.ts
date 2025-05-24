import { Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

import { IEventBoxFactory } from "@/common/events";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class IdentityEventBoxFactory implements IEventBoxFactory {
    public constructor(
        @InjectTransactionHost(IDENTITY_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>
    ) {}

    public createOutboxOptions(context: string) {
        return this.createOptions(context);
    }

    public createInboxOptions(context: string) {
        return this.createOptions(context);
    }

    private createOptions(context: string) {
        return {
            txHost: this.txHost,
            context,
        };
    }
}
