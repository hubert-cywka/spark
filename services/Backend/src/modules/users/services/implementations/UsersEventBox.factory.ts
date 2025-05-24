import { Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

import { IEventBoxFactory } from "@/common/events";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants";

@Injectable()
export class UsersEventBoxFactory implements IEventBoxFactory {
    public constructor(
        @InjectTransactionHost(USERS_MODULE_DATA_SOURCE)
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
