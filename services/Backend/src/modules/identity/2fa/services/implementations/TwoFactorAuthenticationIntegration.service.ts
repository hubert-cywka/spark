import { Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { TOTP } from "otpauth";
import { IsNull, Not, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { TOTP_LENGTH } from "@/modules/identity/2fa/constants";
import { TwoFactorAuthenticationIntegrationEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationIntegration.entity";
import { IntegrationAlreadyEnabledError } from "@/modules/identity/2fa/errors/IntegrationAlreadyEnabled.error";
import { IntegrationNotFoundError } from "@/modules/identity/2fa/errors/IntegrationNotFound.error";
import { NotEnoughIntegrationsEnabledError } from "@/modules/identity/2fa/errors/NotEnoughIntegrationsEnabled.error";
import { TOTPInvalidError } from "@/modules/identity/2fa/errors/TOTPInvalid.error";
import { type ITwoFactorAuthenticationIntegrationService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationIntegration.service";
import {
    type ITwoFactorAuthenticationSecretManager,
    TwoFactorAuthenticationSecretManagerToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationSecretManager.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { type User } from "@/types/User";

const DEFAULT_VERIFICATION_WINDOW = 3;

export abstract class TwoFactorAuthenticationIntegrationService implements ITwoFactorAuthenticationIntegrationService {
    protected readonly logger = new Logger(TwoFactorAuthenticationIntegrationService.name);
    private readonly appName: string;

    protected constructor(
        @InjectRepository(TwoFactorAuthenticationIntegrationEntity, IDENTITY_MODULE_DATA_SOURCE)
        private readonly repository: Repository<TwoFactorAuthenticationIntegrationEntity>,
        @Inject(TwoFactorAuthenticationSecretManagerToken)
        private readonly secretManager: ITwoFactorAuthenticationSecretManager,
        configService: ConfigService
    ) {
        this.appName = configService.getOrThrow<string>("appName");
    }

    @Transactional({ connectionName: IDENTITY_MODULE_DATA_SOURCE })
    public async issueTOTP(user: User): Promise<void> {
        if (!this.canIssueCode()) {
            this.logger.log({ method: this.get2FAMethod() }, "Method doesn't support issuing codes on demand.");
            return;
        }

        const method = await this.findMethodByAccountId(user.id);

        if (!method?.enabledAt) {
            this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "2FA integration not found.");
            throw new IntegrationNotFoundError();
        }

        const otpProvider = this.createOtpProvider(user, method.secret, method.totpTTL);
        const code = otpProvider.generate();
        await this.onCodeIssued(user, code);
    }

    @Transactional({ connectionName: IDENTITY_MODULE_DATA_SOURCE })
    public async createMethodIntegration(user: User) {
        const method = await this.findMethodByAccountId(user.id);

        if (method?.enabledAt) {
            this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "2FA method is already enabled.");
            throw new IntegrationAlreadyEnabledError();
        }

        const secret = await this.save2FAMethod({
            ownerId: user.id,
            methodId: method?.id,
        });

        const totpTTL = method?.totpTTL ?? this.getTOTPDefaultTimeToLive();
        const otpProvider = this.createOtpProvider(user, secret, totpTTL);
        await this.onMethodCreated(user, otpProvider);

        return otpProvider.toString();
    }

    @Transactional({ connectionName: IDENTITY_MODULE_DATA_SOURCE })
    public async deleteMethodIntegration(user: User) {
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
    }

    @Transactional({ connectionName: IDENTITY_MODULE_DATA_SOURCE })
    public async confirmMethodIntegration(user: User, code: string) {
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
    }

    @Transactional({ connectionName: IDENTITY_MODULE_DATA_SOURCE })
    public async validateTOTP(user: User, code: string): Promise<boolean> {
        const method = await this.findMethodByAccountId(user.id);

        if (!method?.enabledAt) {
            this.logger.warn({ accountId: user.id, method: this.get2FAMethod() }, "2FA method not found.");
            throw new IntegrationNotFoundError();
        }

        return this.verifyCodeSync(user, code, method.secret, method.totpTTL);
    }

    private verifyCodeSync(user: User, code: string, secret: string, totpTTL: number): boolean {
        const otpProvider = this.createOtpProvider(user, secret, totpTTL);
        const delta = otpProvider.validate({
            token: code,
            window: DEFAULT_VERIFICATION_WINDOW,
        });

        return delta !== null;
    }

    private async save2FAMethod({ methodId, ownerId }: { methodId?: string; ownerId?: string }) {
        const repository = this.getRepository();
        const { encryptedSecret, decryptedSecret } = await this.secretManager.generateSecret();

        await repository.save({
            id: methodId,
            ownerId,
            secret: encryptedSecret,
            method: this.get2FAMethod(),
            totpTTL: this.getTOTPDefaultTimeToLive(),
        });

        return decryptedSecret;
    }

    private async findMethodByAccountId(accountId: string) {
        const method = await this.getRepository().findOne({
            where: { method: this.get2FAMethod(), owner: { id: accountId } },
        });

        if (!method) {
            return null;
        }

        return {
            ...method,
            secret: await this.secretManager.decryptSecret(method.secret),
        };
    }

    private createOtpProvider(user: User, secret: string, totpTTL: number) {
        return new TOTP({
            issuer: this.appName,
            label: `${user.email} (${user.id})`,
            secret,
            period: totpTTL,
            digits: TOTP_LENGTH,
        });
    }

    private getRepository(): Repository<TwoFactorAuthenticationIntegrationEntity> {
        return this.repository;
    }

    protected onCodeIssued(user: User, code: string): Promise<void> | void {}
    protected onMethodCreated(user: User, provider: TOTP): Promise<void> | void {}

    protected abstract canIssueCode(): boolean;
    protected abstract get2FAMethod(): TwoFactorAuthenticationMethod;
    protected abstract getTOTPDefaultTimeToLive(): number;
}
