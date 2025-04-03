import { Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Secret, TOTP } from "otpauth";
import { IsNull, Not, Repository } from "typeorm";

import { TOTP_LENGTH } from "@/modules/identity/2fa/constants";
import { TwoFactorAuthenticationOptionEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationOption.entity";
import { AtLeastOne2FAMethodRequiredError } from "@/modules/identity/2fa/errors/AtLeastOne2FAMethodRequired.error";
import { TOTPInvalidError } from "@/modules/identity/2fa/errors/TOTPInvalid.error";
import { TwoFactorAuthMethodAlreadyEnabledError } from "@/modules/identity/2fa/errors/TwoFactorAuthMethodAlreadyEnabled.error";
import { TwoFactorAuthMethodNotFoundError } from "@/modules/identity/2fa/errors/TwoFactorAuthMethodNotFound.error";
import type { ITwoFactorAuthenticationService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthentication.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { type User } from "@/types/User";

const DEFAULT_VERIFICATION_WINDOW = 3;

export abstract class TwoFactorAuthenticationBaseService implements ITwoFactorAuthenticationService {
    protected readonly logger = new Logger(TwoFactorAuthenticationBaseService.name);

    protected constructor(private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>) {}

    public async issueCode(user: User): Promise<void> {
        if (!this.canIssueCode()) {
            this.logger.log({ method: this.get2FAMethod() }, "Method doesn't support issuing codes on demand.");
            return;
        }

        await this.txHost.withTransaction(async () => {
            const method = await this.findMethodByAccountId(user.id);

            if (!method?.enabledAt) {
                this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "2FA method not found.");
                throw new TwoFactorAuthMethodNotFoundError();
            }

            const otpProvider = this.createOtpProvider(user, method.secret);
            const code = otpProvider.generate();
            await this.onCodeIssued(user, code);
        });
    }

    public async createMethod(user: User) {
        return await this.txHost.withTransaction(async () => {
            const method = await this.findMethodByAccountId(user.id);

            if (method?.enabledAt) {
                this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "2FA method is already enabled.");
                throw new TwoFactorAuthMethodAlreadyEnabledError();
            }

            let secret: string;

            if (method) {
                secret = await this.overwrite2FAMethodSecret(method.id);
            } else {
                secret = await this.createNew2FAMethod(user.id);
            }

            const otpProvider = this.createOtpProvider(user, secret);
            await this.onMethodCreated(user, otpProvider);

            return otpProvider.toString();
        });
    }

    public async deleteMethod(user: User) {
        return await this.txHost.withTransaction(async () => {
            const method = await this.findMethodByAccountId(user.id);

            if (!method?.enabledAt) {
                this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "2FA method not found.");
                throw new TwoFactorAuthMethodNotFoundError();
            }

            const repository = this.getRepository();
            const otherMethods = await repository.find({
                where: {
                    owner: { id: user.id },
                    method: Not(method.method),
                    enabledAt: Not(IsNull()),
                },
            });

            if (!otherMethods.length) {
                this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "At least 1 2FA method needs to be enabled.");
                throw new AtLeastOne2FAMethodRequiredError();
            }

            await repository.delete({ id: method.id });
        });
    }

    public async confirmMethod(user: User, code: string) {
        return await this.txHost.withTransaction(async () => {
            const method = await this.findMethodByAccountId(user.id);

            if (!method) {
                this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "2FA method not found.");
                throw new TwoFactorAuthMethodNotFoundError();
            }

            if (method.enabledAt) {
                this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "2FA method is already enabled.");
                throw new TwoFactorAuthMethodAlreadyEnabledError();
            }

            const verificationResult = this.verifyCodeSync(user, code, method.secret);

            if (!verificationResult) {
                this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "Invalid TOTP.");
                throw new TOTPInvalidError();
            }

            const repository = this.getRepository();
            await repository.save({ ...method, enabledAt: new Date() });

            return true;
        });
    }

    public async verifyCode(user: User, code: string): Promise<boolean> {
        return await this.txHost.withTransaction(async () => {
            const method = await this.findMethodByAccountId(user.id);

            if (!method?.enabledAt) {
                this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "2FA method not found.");
                throw new TwoFactorAuthMethodNotFoundError();
            }

            return this.verifyCodeSync(user, code, method.secret);
        });
    }

    private verifyCodeSync(user: User, code: string, secret: string): boolean {
        const otpProvider = this.createOtpProvider(user, secret);
        const delta = otpProvider.validate({
            token: code,
            window: DEFAULT_VERIFICATION_WINDOW,
        });

        return delta !== null;
    }

    private async createNew2FAMethod(accountId: string) {
        const repository = this.getRepository();
        const secret = new Secret().base32;
        await repository.save({
            owner: { id: accountId },
            method: this.get2FAMethod(),
            secret,
        });
        return secret;
    }

    private async overwrite2FAMethodSecret(methodId: string) {
        const repository = this.getRepository();
        const secret = new Secret().base32;
        await repository.save({ id: methodId, secret });
        return secret;
    }

    private async findMethodByAccountId(accountId: string) {
        return await this.getRepository().findOne({
            where: { method: this.get2FAMethod(), owner: { id: accountId } },
        });
    }

    private createOtpProvider(user: User, secret: string) {
        return new TOTP({
            // TODO: Get app name
            issuer: "Codename",
            label: `${user.email} (${user.id})`,
            secret,
            period: this.getTOTPTimeToLive(),
            digits: TOTP_LENGTH,
        });
    }

    private getRepository(): Repository<TwoFactorAuthenticationOptionEntity> {
        return this.txHost.tx.getRepository(TwoFactorAuthenticationOptionEntity);
    }

    protected onCodeIssued(user: User, code: string): Promise<void> | void {}
    protected onMethodCreated(user: User, provider: TOTP): Promise<void> | void {}

    protected abstract canIssueCode(): boolean;
    protected abstract get2FAMethod(): TwoFactorAuthenticationMethod;

    // TODO: Store TTL in database
    protected abstract getTOTPTimeToLive(): number;
}
