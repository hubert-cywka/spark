import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import dayjs from "dayjs";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { FederatedAccountEntity } from "@/modules/identity/account/entities/FederatedAccountEntity";
import { AccountAlreadyExistsError } from "@/modules/identity/account/errors/AccountAlreadyExists.error";
import { AccountNotFoundError } from "@/modules/identity/account/errors/AccountNotFound.error";
import { AccountSuspendedError } from "@/modules/identity/account/errors/AccountSuspended.error";
import { type IAccountMapper, AccountMapperToken } from "@/modules/identity/account/mappers/IAccount.mapper";
import { Account } from "@/modules/identity/account/models/Account.model";
import {
    type IAccountEventsPublisher,
    AccountEventsPublisherToken,
} from "@/modules/identity/account/services/interfaces/IAccountEventsPublisher.service";
import { type IFederatedAccountService } from "@/modules/identity/account/services/interfaces/IFederatedAccount.service";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class FederatedAccountService implements IFederatedAccountService {
    private readonly logger = new Logger(FederatedAccountService.name);

    constructor(
        @InjectRepository(FederatedAccountEntity, IDENTITY_MODULE_DATA_SOURCE)
        private readonly repository: Repository<FederatedAccountEntity>,
        @Inject(AccountMapperToken)
        private readonly accountMapper: IAccountMapper,
        @Inject(AccountEventsPublisherToken)
        private readonly publisher: IAccountEventsPublisher
    ) {}

    public async findByExternalIdentity(identity: ExternalIdentity): Promise<Account> {
        const account = await this.getRepository().findOne({
            where: {
                providerAccountId: identity.id,
                providerId: identity.providerId,
            },
        });

        if (!account) {
            this.logger.warn(
                {
                    providerAccountId: identity.id,
                    providerId: identity.providerId,
                },
                "Account not found."
            );
            throw new AccountNotFoundError();
        }

        if (account.suspendedAt) {
            this.logger.warn(
                {
                    providerAccountId: identity.id,
                    providerId: identity.providerId,
                    suspendedAt: account.suspendedAt,
                },
                "Account is suspended."
            );
            throw new AccountSuspendedError();
        }

        return this.accountMapper.fromEntityToModel(account);
    }

    @Transactional({ connectionName: IDENTITY_MODULE_DATA_SOURCE })
    public async createAccountWithExternalIdentity(identity: ExternalIdentity): Promise<Account> {
        const repository = this.getRepository();
        const existingAccount = await repository.findOne({
            where: {
                providerAccountId: identity.id,
                providerId: identity.providerId,
            },
        });

        if (existingAccount) {
            this.logger.warn(
                {
                    providerAccountId: identity.id,
                    providerId: identity.providerId,
                },
                "Account already exists."
            );
            throw new AccountAlreadyExistsError();
        }

        const now = dayjs();

        const insertionResult = await repository
            .createQueryBuilder("account")
            .insert()
            .into(FederatedAccountEntity)
            .values({
                email: identity.email,
                providerId: identity.providerId,
                providerAccountId: identity.id,
                termsAndConditionsAcceptedAt: now,
            })
            .returning("*")
            .execute();

        const account = insertionResult.raw[0] as FederatedAccountEntity;
        await this.publisher.onAccountCreated(account.id, account.email);

        return this.accountMapper.fromEntityToModel(account);
    }

    @Transactional({ connectionName: IDENTITY_MODULE_DATA_SOURCE })
    public async activateByInternalId(id: string): Promise<void> {
        const repository = this.getRepository();
        const account = await repository.findOne({ where: { id } });

        if (!account) {
            this.logger.warn({ accountId: id }, "Couldn't find account.");
            throw new AccountNotFoundError();
        }

        await repository.save({ ...account, activatedAt: new Date() });
        await this.publisher.onAccountActivated(account.id, account.email);
    }

    private getRepository(): Repository<FederatedAccountEntity> {
        return this.repository;
    }
}
