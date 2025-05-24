import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { AccountNotFoundError } from "@/modules/identity/account/errors/AccountNotFound.error";
import {
    type IAccountPublisherService,
    AccountPublisherServiceToken,
} from "@/modules/identity/account/services/interfaces/IAccountPublisher.service";
import { type IAccountRemovalService } from "@/modules/identity/account/services/interfaces/IAccountRemoval.service";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class AccountRemovalService implements IAccountRemovalService {
    private readonly logger = new Logger(AccountRemovalService.name);

    constructor(
        @InjectRepository(BaseAccountEntity, IDENTITY_MODULE_DATA_SOURCE)
        private readonly repository: Repository<BaseAccountEntity>,
        @Inject(AccountPublisherServiceToken)
        private readonly publisher: IAccountPublisherService
    ) {}

    @Transactional({ connectionName: IDENTITY_MODULE_DATA_SOURCE })
    public async removeByInternalId(id: string): Promise<void> {
        const repository = this.getRepository();
        const account = await repository.findOne({ where: { id } });

        if (!account) {
            this.logger.warn({ accountId: id }, "Couldn't find account.");
            throw new AccountNotFoundError();
        }

        await repository.remove([account]);
    }

    @Transactional({ connectionName: IDENTITY_MODULE_DATA_SOURCE })
    public async suspendByInternalId(id: string): Promise<void> {
        const repository = this.getRepository();
        const account = await repository.findOne({ where: { id } });

        if (!account) {
            this.logger.warn({ accountId: id }, "Couldn't find account.");
            throw new AccountNotFoundError();
        }

        await repository.save({ ...account, suspendedAt: new Date() });
        await this.publisher.onAccountSuspended(id);
    }

    private getRepository(): Repository<BaseAccountEntity> {
        return this.repository;
    }
}
