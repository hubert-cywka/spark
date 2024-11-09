import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import dayjs from "dayjs";
import type { Repository } from "typeorm";

import { AccountEntity } from "@/modules/identity/account/entities/AccountEntity";
import { AccountAlreadyExistsError } from "@/modules/identity/account/errors/AccountAlreadyExists.error";
import { AccountNotFoundError } from "@/modules/identity/account/errors/AccountNotFound.error";
import { Account } from "@/modules/identity/account/models/Account.model";
import { type IFederatedAccountService } from "@/modules/identity/account/services/interfaces/IFederatedAccount.service";
import type { AccountProvider } from "@/modules/identity/authentication/types/AccountProvider";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants/connectionName";

@Injectable()
export class FederatedAccountService implements IFederatedAccountService {
    private readonly logger = new Logger(FederatedAccountService.name);

    constructor(
        @InjectRepository(AccountEntity, IDENTITY_MODULE_DATA_SOURCE)
        private readonly repository: Repository<AccountEntity>
    ) {}

    public async findByExternalIdentity(identity: ExternalIdentity, providerId: AccountProvider): Promise<Account> {
        const account = await this.repository.findOne({
            where: { providerAccountId: identity.id, providerId },
        });

        if (!account) {
            this.logger.warn({ providerAccountId: identity.id, providerId }, "Account not found.");
            throw new AccountNotFoundError();
        }

        return this.mapEntityToModel(account);
    }

    public async createAccountWithExternalIdentity(identity: ExternalIdentity, providerId: AccountProvider): Promise<Account> {
        const existingAccount = await this.repository.findOne({
            where: { providerAccountId: identity.id, providerId },
        });

        if (existingAccount) {
            this.logger.warn({ providerAccountId: identity.id, providerId }, "Account already exists.");
            throw new AccountAlreadyExistsError();
        }

        const now = dayjs();

        const accountEntity = this.repository.create({
            email: identity.email,
            providerId,
            providerAccountId: identity.id,
            activatedAt: now,
            termsAndConditionsAcceptedAt: now,
        });

        const account = await this.repository.save(accountEntity);
        return this.mapEntityToModel(account);
    }

    private mapEntityToModel(entity: AccountEntity): Account {
        return plainToInstance(Account, {
            id: entity.id,
            email: entity.email,
            providerId: entity.providerId,
            providerAccountId: entity.providerAccountId,
        });
    }
}
