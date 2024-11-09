import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import argon2 from "argon2";
import { plainToInstance } from "class-transformer";
import dayjs from "dayjs";
import type { Repository } from "typeorm";

import { AccountEntity } from "@/modules/identity/account/entities/AccountEntity";
import { AccountAlreadyActivatedError } from "@/modules/identity/account/errors/AccountAlreadyActivated.error";
import { AccountAlreadyExistsError } from "@/modules/identity/account/errors/AccountAlreadyExists.error";
import { AccountCorruptedError } from "@/modules/identity/account/errors/AccountCorrupted.error";
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
import { AccountProvider } from "@/modules/identity/authentication/types/AccountProvider";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants/connectionName";

@Injectable()
// TODO: OIDC Rename to CredentialsBasedAccountService, apply same change for other things
export class ManagedAccountService implements IManagedAccountService {
    private readonly logger = new Logger(ManagedAccountService.name);

    constructor(
        @InjectRepository(AccountEntity, IDENTITY_MODULE_DATA_SOURCE)
        private readonly repository: Repository<AccountEntity>,
        @Inject(IAccountPublisherServiceToken)
        private readonly publisher: IAccountPublisherService,
        @Inject(ISingleUseTokenServiceToken)
        private readonly singleUseTokenService: ISingleUseTokenService
    ) {}

    // TODO: Protect from timing attacks to prevent leaking emails
    public async findActivatedByCredentials(email: string, password: string): Promise<Account> {
        const account = await this.findOne(email);

        // Hubert: This should never happen and the user has no option to fix this so treat this as server error.
        if (!account.assertManagedAccountInvariants()) {
            throw new AccountCorruptedError();
        }

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
        const existingAccount = await this.repository.findOne({
            where: { email, providerId: AccountProvider.CREDENTIALS },
        });

        if (existingAccount) {
            this.logger.warn({ email }, "Account already exists.");
            throw new AccountAlreadyExistsError();
        }

        const hashedPassword = await this.hashPassword(password);
        const accountEntity = this.repository.create({
            email,
            password: hashedPassword,
            providerId: AccountProvider.CREDENTIALS,
            providerAccountId: email,
            termsAndConditionsAcceptedAt: dayjs(),
        });

        const account = await this.repository.save(accountEntity);
        return this.mapEntityToModel(account);
    }

    public async requestPasswordChange(email: string): Promise<void> {
        const account = await this.findOne(email);
        const passwordResetToken = await this.singleUseTokenService.issuePasswordChangeToken(account.id);
        this.publisher.onPasswordResetRequested(account.email, passwordResetToken);
    }

    public async updatePassword(passwordChangeToken: string, password: string): Promise<void> {
        const { ownerId } = await this.singleUseTokenService.redeemPasswordChangeToken(passwordChangeToken);
        const account = await this.repository.findOne({
            where: { id: ownerId },
        });

        if (!account) {
            this.logger.warn({ id: ownerId, token: passwordChangeToken }, "Owner of token was not found.");
            throw new AccountNotFoundError();
        }

        const hashedPassword = await this.hashPassword(password);
        await this.repository.save({
            ...account,
            passwordResetToken: null,
            password: hashedPassword,
        });

        this.publisher.onPasswordUpdated(account.email, account.id);
    }

    public async activate(activationToken: string): Promise<void> {
        const { ownerId } = await this.singleUseTokenService.redeemAccountActivationToken(activationToken);
        const account = await this.repository.findOne({
            where: { id: ownerId },
        });

        if (!account) {
            this.logger.warn({ id: ownerId, token: activationToken }, "Owner of the token was not found.");
            throw new AccountNotFoundError();
        }

        this.assertEligibilityForActivation(account);
        const { email, id } = await this.repository.save({
            id: ownerId,
            activatedAt: dayjs(),
        });
        this.publisher.onAccountActivated(email, id);
    }

    public async requestActivation(email: string): Promise<void> {
        const account = await this.findOne(email);
        this.assertEligibilityForActivation(account);

        const activationToken = await this.singleUseTokenService.issueAccountActivationToken(account.id);
        this.publisher.onAccountActivationTokenRequested(email, activationToken);
    }

    private async findOne(providerAccountId: string): Promise<AccountEntity> {
        const account = await this.repository.findOne({
            where: {
                providerAccountId,
                providerId: AccountProvider.CREDENTIALS,
            },
        });

        if (!account) {
            this.logger.warn({ providerAccountId, providerId: AccountProvider.CREDENTIALS }, "Account not found.");
            throw new AccountNotFoundError();
        }

        return account;
    }

    private assertEligibilityForActivation(account: AccountEntity): void {
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

    private mapEntityToModel(entity: AccountEntity): Account {
        return plainToInstance(Account, {
            id: entity.id,
            email: entity.email,
            providerId: entity.providerId,
            providerAccountId: entity.providerAccountId,
        });
    }
}
