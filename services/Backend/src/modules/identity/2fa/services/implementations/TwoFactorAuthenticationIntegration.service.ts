import { Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Secret, TOTP } from "otpauth";
import { IsNull, Not, Repository } from "typeorm";

import { TOTP_LENGTH } from "@/modules/identity/2fa/constants";
import { TwoFactorAuthenticationIntegrationEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationIntegration.entity";
import { IntegrationAlreadyEnabledError } from "@/modules/identity/2fa/errors/IntegrationAlreadyEnabled.error";
import { IntegrationNotFoundError } from "@/modules/identity/2fa/errors/IntegrationNotFound.error";
import { NotEnoughIntegrationsEnabledError } from "@/modules/identity/2fa/errors/NotEnoughIntegrationsEnabled.error";
import { TOTPInvalidError } from "@/modules/identity/2fa/errors/TOTPInvalid.error";
import { type ITwoFactorAuthenticationIntegrationService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationIntegration.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { type User } from "@/types/User";

const DEFAULT_VERIFICATION_WINDOW = 3;

export abstract class TwoFactorAuthenticationIntegrationService implements ITwoFactorAuthenticationIntegrationService {
    protected readonly logger = new Logger(TwoFactorAuthenticationIntegrationService.name);

    protected constructor(private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>) {}

    public async issueTOTP(user: User): Promise<void> {
        if (!this.canIssueCode()) {
            this.logger.log({ method: this.get2FAMethod() }, "Method doesn't support issuing codes on demand.");
            return;
        }

        await this.txHost.withTransaction(async () => {
            const method = await this.findMethodByAccountId(user.id);

            if (!method?.enabledAt) {
                this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "2FA integration not found.");
                throw new IntegrationNotFoundError();
            }

            const otpProvider = this.createOtpProvider(user, method.secret, method.totpTTL);
            const code = otpProvider.generate();
            await this.onCodeIssued(user, code);
        });
    }

    public async createMethodIntegration(user: User) {
        return await this.txHost.withTransaction(async () => {
            const method = await this.findMethodByAccountId(user.id);

            if (method?.enabledAt) {
                this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "2FA method is already enabled.");
                throw new IntegrationAlreadyEnabledError();
            }

            let secret: string;

            if (method) {
                secret = await this.overwrite2FAMethodSecret(method.id);
            } else {
                secret = await this.createNew2FAMethod(user.id);
            }

            const totpTTL = method?.totpTTL ?? this.getTOTPDefaultTimeToLive();
            const otpProvider = this.createOtpProvider(user, secret, totpTTL);
            await this.onMethodCreated(user, otpProvider);

            return otpProvider.toString();
        });
    }

    public async deleteMethodIntegration(user: User) {
        return await this.txHost.withTransaction(async () => {
            const method = await this.findMethodByAccountId(user.id);

            if (!method?.enabledAt) {
                this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "2FA method not found.");
                throw new IntegrationNotFoundError();
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
                throw new NotEnoughIntegrationsEnabledError();
            }

            await repository.delete({ id: method.id });
        });
    }

    public async confirmMethodIntegration(user: User, code: string) {
        return await this.txHost.withTransaction(async () => {
            const method = await this.findMethodByAccountId(user.id);

            if (!method) {
                this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "2FA method not found.");
                throw new IntegrationNotFoundError();
            }

            if (method.enabledAt) {
                this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "2FA method is already enabled.");
                throw new IntegrationAlreadyEnabledError();
            }

            const verificationResult = this.verifyCodeSync(user, code, method.secret, method.totpTTL);

            if (!verificationResult) {
                this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "Invalid TOTP.");
                throw new TOTPInvalidError();
            }

            const repository = this.getRepository();
            await repository.save({ ...method, enabledAt: new Date() });

            return true;
        });
    }

    public async validateTOTP(user: User, code: string): Promise<boolean> {
        return await this.txHost.withTransaction(async () => {
            const method = await this.findMethodByAccountId(user.id);

            if (!method?.enabledAt) {
                this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "2FA method not found.");
                throw new IntegrationNotFoundError();
            }

            return this.verifyCodeSync(user, code, method.secret, method.totpTTL);
        });
    }

    private verifyCodeSync(user: User, code: string, secret: string, totpTTL: number): boolean {
        const otpProvider = this.createOtpProvider(user, secret, totpTTL);
        const delta = otpProvider.validate({
            token: code,
            window: DEFAULT_VERIFICATION_WINDOW,
        });

        return delta !== null;
    }

    private async createNew2FAMethod(accountId: string) {
        const repository = this.getRepository();
        const secret = this.generateSecret();

        await repository.save({
            owner: { id: accountId },
            method: this.get2FAMethod(),
            secret,
            totpTTL: this.getTOTPDefaultTimeToLive(),
        });
        return secret;
    }

    private async overwrite2FAMethodSecret(methodId: string) {
        const repository = this.getRepository();
        const secret = this.generateSecret();

        await repository.save({
            id: methodId,
            secret,
            totpTTL: this.getTOTPDefaultTimeToLive(),
        });
        return secret;
    }

    private async findMethodByAccountId(accountId: string) {
        return await this.getRepository().findOne({
            where: { method: this.get2FAMethod(), owner: { id: accountId } },
        });
    }

    private createOtpProvider(user: User, secret: string, totpTTL: number) {
        return new TOTP({
            // TODO: Get app name
            issuer: "Codename",
            label: `${user.email} (${user.id})`,
            secret,
            period: totpTTL,
            digits: TOTP_LENGTH,
        });
    }

    private getRepository(): Repository<TwoFactorAuthenticationIntegrationEntity> {
        return this.txHost.tx.getRepository(TwoFactorAuthenticationIntegrationEntity);
    }

    private generateSecret() {
        return new Secret().base32;
    }

    protected onCodeIssued(user: User, code: string): Promise<void> | void {}
    protected onMethodCreated(user: User, provider: TOTP): Promise<void> | void {}

    protected abstract canIssueCode(): boolean;
    protected abstract get2FAMethod(): TwoFactorAuthenticationMethod;
    protected abstract getTOTPDefaultTimeToLive(): number;
}
