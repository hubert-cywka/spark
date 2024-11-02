import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import argon2 from "argon2";
import { plainToInstance } from "class-transformer";
import dayjs from "dayjs";
import { Repository } from "typeorm";

import { AccountEntity } from "@/modules/identity/account/entities/AccountEntity";
import { AccountAlreadyActivatedError } from "@/modules/identity/account/errors/AccountAlreadyActivated.error";
import { AccountAlreadyExistsError } from "@/modules/identity/account/errors/AccountAlreadyExists.error";
import { AccountNotFoundError } from "@/modules/identity/account/errors/AccountNotFound.error";
import { Account } from "@/modules/identity/account/models/Account.model";
import { IAccountService } from "@/modules/identity/account/services/interfaces/IAccount.service";
import {
    IAccountPublisherService,
    IAccountPublisherServiceToken,
} from "@/modules/identity/account/services/interfaces/IAccountPublisher.service";
import {
    ISingleUseTokenService,
    ISingleUseTokenServiceToken,
} from "@/modules/identity/account/services/interfaces/ISingleUseToken.service";
import { InvalidCredentialsError } from "@/modules/identity/authentication/errors/InvalidCredentials.error";

@Injectable()
export class AccountService implements IAccountService {
    private readonly logger = new Logger(AccountService.name);

    constructor(
        @InjectRepository(AccountEntity)
        private readonly repository: Repository<AccountEntity>,
        @Inject(IAccountPublisherServiceToken)
        private readonly publisher: IAccountPublisherService,
        @Inject(ISingleUseTokenServiceToken)
        private readonly singleUseTokenService: ISingleUseTokenService
    ) {}

    public async requestPasswordChange(email: string): Promise<void> {
        const account = await this.repository.findOne({
            where: { email },
        });

        if (!account) {
            this.logger.warn({ email }, "Account not found.");
            throw new AccountNotFoundError();
        }

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

    // TODO: Protect from timing attacks to prevent leaking emails
    public async findByCredentials(email: string, password: string): Promise<Account> {
        const account = await this.repository.findOne({
            where: { email },
        });

        if (!account) {
            this.logger.warn({ email }, "Account not found.");
            throw new AccountNotFoundError();
        }

        if (!(await this.verifyPassword(account.password, password))) {
            this.logger.warn({ id: account.id }, "Account found, incorrect password.");
            throw new InvalidCredentialsError();
        }

        if (!account.activatedAt) {
            this.logger.warn({ id: account.id }, "Account not activated.");
            throw new InvalidCredentialsError();
        }

        return this.mapEntityToModel(account);
    }

    public async save(email: string, password: string): Promise<Account> {
        const existingAccount = await this.repository.findOne({
            where: { email },
        });

        if (existingAccount) {
            this.logger.warn({ email }, "Account already exists.");
            throw new AccountAlreadyExistsError();
        }

        const hashedPassword = await this.hashPassword(password);
        const accountEntity = this.repository.create({
            email,
            password: hashedPassword,
        });

        const account = await this.repository.save(accountEntity);
        return this.mapEntityToModel(account);
    }

    public async activate(activationToken: string): Promise<void> {
        const { ownerId } = await this.singleUseTokenService.redeemAccountActivationToken(activationToken);
        const account = await this.repository.findOne({
            where: { id: ownerId },
        });

        if (!account) {
            this.logger.warn({ id: ownerId, token: activationToken }, "Owner of token was not found.");
            throw new AccountNotFoundError();
        }

        this.assertEligibilityForActivation(account);
        const { email, id } = await this.repository.save({
            ...account,
            activatedAt: dayjs(),
        });
        this.publisher.onAccountActivated({ email, id });
    }

    public async requestActivation(email: string): Promise<void> {
        const account = await this.repository.findOne({
            where: { email },
        });

        if (!account) {
            this.logger.warn({ email }, "Account not found.");
            throw new AccountNotFoundError();
        }

        this.assertEligibilityForActivation(account);
        const activationToken = await this.singleUseTokenService.issueAccountActivationToken(account.id);
        this.publisher.onAccountActivationTokenRequested(email, activationToken);
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
        return plainToInstance(Account, { id: entity.id, email: entity.email });
    }
}
