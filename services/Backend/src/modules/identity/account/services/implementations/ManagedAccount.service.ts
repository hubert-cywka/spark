import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectTransactionHost, Transactional, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import argon2 from "argon2";
import { plainToInstance } from "class-transformer";
import dayjs from "dayjs";
import { Repository } from "typeorm";

import { ManagedAccountEntity } from "@/modules/identity/account/entities/ManagedAccountEntity";
import { AccountAlreadyActivatedError } from "@/modules/identity/account/errors/AccountAlreadyActivated.error";
import { AccountAlreadyExistsError } from "@/modules/identity/account/errors/AccountAlreadyExists.error";
import { AccountNotActivatedError } from "@/modules/identity/account/errors/AccountNotActivated.error";
import { AccountNotFoundError } from "@/modules/identity/account/errors/AccountNotFound.error";
import { Account } from "@/modules/identity/account/models/Account.model";
import {
    type IAccountPublisherService,
    IAccountPublisherServiceToken,
} from "@/modules/identity/account/services/interfaces/IAccountPublisher.service";
import { IManagedAccountService } from "@/modules/identity/account/services/interfaces/IManagedAccount.service";
import {
    type ISingleUseTokenService,
    ISingleUseTokenServiceToken,
} from "@/modules/identity/account/services/interfaces/ISingleUseToken.service";
import { InvalidCredentialsError } from "@/modules/identity/authentication/errors/InvalidCredentials.error";
import { ManagedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class ManagedAccountService implements IManagedAccountService {
    private readonly logger = new Logger(ManagedAccountService.name);

    constructor(
        @InjectTransactionHost(IDENTITY_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(IAccountPublisherServiceToken)
        private readonly publisher: IAccountPublisherService,
        @Inject(ISingleUseTokenServiceToken)
        private readonly singleUseTokenService: ISingleUseTokenService
    ) {}

    // TODO: Protect from timing attacks to prevent leaking emails
    public async findActivatedByCredentials(email: string, password: string): Promise<Account> {
        const account = await this.findOne(email);

        if (!(await this.verifyPassword(account.password, password))) {
            this.logger.warn({ id: account.id }, "Account found, incorrect password.");
            throw new InvalidCredentialsError();
        }

        if (!account.activatedAt) {
            this.logger.warn({ id: account.id }, "Account not activated.");
            throw new AccountNotActivatedError();
        }

        return this.mapEntityToModel(account);
    }

    public async createAccountWithCredentials(email: string, password: string): Promise<Account> {
        const existingAccount = await this.getRepository().findOne({
            where: { email, providerId: ManagedAccountProvider.CREDENTIALS },
        });

        if (existingAccount) {
            this.logger.warn({ email }, "Account already exists.");
            throw new AccountAlreadyExistsError();
        }

        const hashedPassword = await this.hashPassword(password);
        const accountEntity = this.getRepository().create({
            email,
            password: hashedPassword,
            providerId: ManagedAccountProvider.CREDENTIALS,
            providerAccountId: email,
            termsAndConditionsAcceptedAt: dayjs(),
        });

        const account = await this.getRepository().save(accountEntity);
        return this.mapEntityToModel(account);
    }

    @Transactional(IDENTITY_MODULE_DATA_SOURCE)
    public async requestPasswordChange(email: string): Promise<void> {
        const account = await this.findOne(email);
        const passwordResetToken = await this.singleUseTokenService.issuePasswordChangeToken(account.id);
        await this.publisher.onPasswordResetRequested(account.email, passwordResetToken);
    }

    @Transactional(IDENTITY_MODULE_DATA_SOURCE)
    public async updatePassword(passwordChangeToken: string, password: string): Promise<void> {
        const { ownerId } = await this.singleUseTokenService.redeemPasswordChangeToken(passwordChangeToken);
        const account = await this.getRepository().findOne({
            where: { id: ownerId },
        });

        if (!account) {
            this.logger.warn({ id: ownerId, token: passwordChangeToken }, "Owner of token was not found.");
            throw new AccountNotFoundError();
        }

        const hashedPassword = await this.hashPassword(password);
        await this.getRepository().save({
            ...account,
            passwordResetToken: null,
            password: hashedPassword,
        });

        await this.publisher.onPasswordUpdated(account.email, account.id);
    }

    @Transactional(IDENTITY_MODULE_DATA_SOURCE)
    public async activate(activationToken: string): Promise<void> {
        const { ownerId } = await this.singleUseTokenService.redeemAccountActivationToken(activationToken);
        const account = await this.getRepository().findOne({
            where: { id: ownerId },
        });

        if (!account) {
            this.logger.warn({ id: ownerId, token: activationToken }, "Owner of the token was not found.");
            throw new AccountNotFoundError();
        }

        this.assertEligibilityForActivation(account);
        await this.getRepository().save({
            id: ownerId,
            activatedAt: dayjs(),
        });
        await this.publisher.onAccountActivated(account.email, account.id);
    }

    @Transactional(IDENTITY_MODULE_DATA_SOURCE)
    public async requestActivation(email: string): Promise<void> {
        const account = await this.findOne(email);
        this.assertEligibilityForActivation(account);

        const activationToken = await this.singleUseTokenService.issueAccountActivationToken(account.id);
        await this.publisher.onAccountActivationTokenRequested(email, activationToken);
    }

    private async findOne(providerAccountId: string): Promise<ManagedAccountEntity> {
        const account = await this.getRepository().findOne({
            where: {
                providerAccountId,
                providerId: ManagedAccountProvider.CREDENTIALS,
            },
        });

        if (!account) {
            this.logger.warn(
                {
                    providerAccountId,
                    providerId: ManagedAccountProvider.CREDENTIALS,
                },
                "Account not found."
            );
            throw new AccountNotFoundError();
        }

        return account;
    }

    private assertEligibilityForActivation(account: ManagedAccountEntity): void {
        if (account.activatedAt) {
            this.logger.warn({ userId: account.id, activatedAt: account.activatedAt }, "Account already activated.");
            throw new AccountAlreadyActivatedError();
        }
    }

    private async hashPassword(password: string): Promise<string> {
        return argon2.hash(password);
    }

    private async verifyPassword(accountPasswordHash: string, inputPassword: string): Promise<boolean> {
        return await argon2.verify(accountPasswordHash, inputPassword);
    }

    private mapEntityToModel(entity: ManagedAccountEntity): Account {
        return plainToInstance(Account, {
            id: entity.id,
            email: entity.email,
            providerId: entity.providerId,
            providerAccountId: entity.providerAccountId,
        });
    }

    private getRepository(): Repository<ManagedAccountEntity> {
        return this.txHost.tx.getRepository(ManagedAccountEntity);
    }
}
