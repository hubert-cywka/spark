import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import argon2 from "argon2";
import { plainToInstance } from "class-transformer";
import * as crypto from "crypto";
import dayjs from "dayjs";
import { Repository } from "typeorm";

import { AccountEntity } from "@/modules/identity/account/entities/AccountEntity";
import { AccountAlreadyActivatedError } from "@/modules/identity/account/errors/AccountAlreadyActivated.error";
import { AccountAlreadyExistsError } from "@/modules/identity/account/errors/AccountAlreadyExists.error";
import { AccountNotFoundError } from "@/modules/identity/account/errors/AccountNotFound.error";
import { Account } from "@/modules/identity/account/models/Account.model";
import {
    IAccountPublisherService,
    IAccountPublisherServiceToken,
} from "@/modules/identity/account/services/interfaces/IAccountPublisherService";
import { IAccountService } from "@/modules/identity/account/services/interfaces/IAccountService";
import { InvalidCredentialsError } from "@/modules/identity/authentication/errors/InvalidCredentials.error";

@Injectable()
export class AccountService implements IAccountService {
    private readonly logger = new Logger(AccountService.name);

    constructor(
        @InjectRepository(AccountEntity)
        private readonly repository: Repository<AccountEntity>,
        @Inject(IAccountPublisherServiceToken)
        private readonly publisher: IAccountPublisherService
    ) {}

    public async requestPasswordChange(email: string): Promise<void> {
        const account = await this.repository.findOne({
            where: { email },
        });

        if (!account) {
            this.logger.warn({ email }, "Account not found.");
            throw new AccountNotFoundError();
        }

        const passwordResetToken = this.generateOneTimeUseToken();
        await this.repository.save({ ...account, passwordResetToken });
        this.publisher.onPasswordResetRequested(account.email, passwordResetToken);
    }

    public async updatePassword(passwordResetToken: string, password: string): Promise<void> {
        const account = await this.repository.findOne({
            where: { passwordResetToken },
        });

        if (!account) {
            this.logger.warn({ passwordResetToken }, "Account with that password reset token not found.");
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

    public async findByCredentials(email: string, password: string): Promise<Account> {
        // Hubert: hashing submitted password before searching for the user to protect from timing attacks
        const hashedPassword = await this.hashPassword(password);

        const account = await this.repository.findOne({
            where: { email },
        });

        if (!account) {
            this.logger.warn({ email }, "Account not found.");
            throw new AccountNotFoundError();
        }

        if (!this.comparePasswordHashes(hashedPassword, account.password)) {
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
        const account = await this.repository.findOne({
            where: { activationToken },
        });

        if (!account) {
            this.logger.warn({ activationToken }, "Account with that activation token not found.");
            throw new AccountNotFoundError();
        }

        this.assertEligibilityForActivation(account);

        const updatedAccount = await this.repository.save({
            ...account,
            activatedAt: dayjs(),
        });
        this.publisher.onAccountActivated({
            email: updatedAccount.email,
            id: updatedAccount.id,
        });
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
        const activationToken = this.generateOneTimeUseToken();

        await this.repository.save({ ...account, activationToken });
        this.publisher.onAccountActivationTokenRequested(email, activationToken);
    }

    private assertEligibilityForActivation(account: AccountEntity): void {
        if (account.activatedAt) {
            this.logger.warn({ userId: account.id, activatedAt: account.activatedAt }, "Account already activated.");
            throw new AccountAlreadyActivatedError();
        }
    }

    private generateOneTimeUseToken(): string {
        return crypto.randomUUID();
    }

    private async hashPassword(password: string): Promise<string> {
        return argon2.hash(password);
    }

    private comparePasswordHashes(password: string, hashedPassword: string): boolean {
        return password === hashedPassword;
    }

    private mapEntityToModel(entity: AccountEntity): Account {
        return plainToInstance(Account, { id: entity.id, email: entity.email });
    }
}
