import { Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

import { IEventBoxFactory } from "@/common/events";
import { MAIL_MODULE_DATA_SOURCE } from "@/modules/mail/infrastructure/database/constants";

@Injectable()
export class MailEventBoxFactory implements IEventBoxFactory {
    public constructor(
        @InjectTransactionHost(MAIL_MODULE_DATA_SOURCE)
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
