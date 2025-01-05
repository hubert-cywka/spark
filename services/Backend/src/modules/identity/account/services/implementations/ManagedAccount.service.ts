import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectTransactionHost, Transactional, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import argon2 from "argon2";
import dayjs from "dayjs";
import { Repository } from "typeorm";

import { ManagedAccountEntity } from "@/modules/identity/account/entities/ManagedAccountEntity";
import { AccountAlreadyActivatedError } from "@/modules/identity/account/errors/AccountAlreadyActivated.error";
import { AccountAlreadyExistsError } from "@/modules/identity/account/errors/AccountAlreadyExists.error";
import { AccountNotActivatedError } from "@/modules/identity/account/errors/AccountNotActivated.error";
import { AccountNotFoundError } from "@/modules/identity/account/errors/AccountNotFound.error";
import { type IAccountMapper, AccountMapperToken } from "@/modules/identity/account/mappers/IAccount.mapper";
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
    private fakePasswordHash: string | null = null;

    constructor(
        @InjectTransactionHost(IDENTITY_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(IAccountPublisherServiceToken)
        private readonly publisher: IAccountPublisherService,
        @Inject(ISingleUseTokenServiceToken)
        private readonly singleUseTokenService: ISingleUseTokenService,
        @Inject(AccountMapperToken)
        private readonly accountMapper: IAccountMapper
    ) {}

    public async findActivatedByCredentials(email: string, password: string): Promise<Account> {
        if (!this.fakePasswordHash) {
            this.fakePasswordHash = await this.generateFakePasswordHash();
        }

        let account: ManagedAccountEntity | null = null;
        let passwordMatches = false;

        try {
            account = await this.findOne(email);
            passwordMatches = await this.verifyPassword(account.password, password);
        } catch (err) {
            // If any error occurs, simulate password verification for timing consistency
            await this.verifyPassword(this.fakePasswordHash, password);
        }

        if (!account || !passwordMatches) {
            this.logger.warn({ email }, "Authentication failed due to incorrect credentials or account not found.");
            throw new InvalidCredentialsError();
        }

        if (!account.activatedAt) {
            this.logger.warn({ id: account.id }, "Account not activated.");
            throw new AccountNotActivatedError();
        }

        return this.accountMapper.fromEntityToModel(account);
    }

    public async createAccountWithCredentials(email: string, password: string): Promise<Account> {
        const repository = this.getRepository();

        const existingAccount = await repository.findOne({
            where: { email, providerId: ManagedAccountProvider.CREDENTIALS },
        });

        if (existingAccount) {
            this.logger.warn({ email }, "Account already exists.");
            throw new AccountAlreadyExistsError();
        }

        const hashedPassword = await this.hashPassword(password);
        const insertionResult = await repository
            .createQueryBuilder("account")
            .insert()
            .into(ManagedAccountEntity)
            .values({
                email,
                password: hashedPassword,
                providerId: ManagedAccountProvider.CREDENTIALS,
                providerAccountId: email,
                termsAndConditionsAcceptedAt: dayjs(),
            })
            .returning("*")
            .execute();

        const account = insertionResult.raw[0] as ManagedAccountEntity;
        return this.accountMapper.fromEntityToModel(account);
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

    private async generateFakePasswordHash(): Promise<string> {
        const randomString = Math.random().toString(36).substring(2, 15);
        return await this.hashPassword(randomString);
    }

    private getRepository(): Repository<ManagedAccountEntity> {
        return this.txHost.tx.getRepository(ManagedAccountEntity);
    }
}
