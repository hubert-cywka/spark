import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { TOTP } from "otpauth";
import { Repository } from "typeorm";

import { TwoFactorAuthenticationIntegrationEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationIntegration.entity";
import { TwoFactorAuthenticationIntegrationService } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationIntegration.service";
import { type ITOTPSecretsManager, TOTPSecretsManagerToken } from "@/modules/identity/2fa/services/interfaces/ITOTPSecretsManager.service";
import {
    type ITwoFactorAuthenticationEventsPublisher,
    TwoFactorAuthenticationEventsPublisherToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationEventsPublisher.service";
import { type ITwoFactorAuthenticationIntegrationService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationIntegration.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { type User } from "@/types/User";

@Injectable()
export class Email2FAIntegrationService
    extends TwoFactorAuthenticationIntegrationService
    implements ITwoFactorAuthenticationIntegrationService
{
    constructor(
        @InjectRepository(TwoFactorAuthenticationIntegrationEntity, IDENTITY_MODULE_DATA_SOURCE)
        repository: Repository<TwoFactorAuthenticationIntegrationEntity>,
        @Inject(TwoFactorAuthenticationEventsPublisherToken)
        private readonly publisher: ITwoFactorAuthenticationEventsPublisher,
        @Inject(TOTPSecretsManagerToken)
        secretManager: ITOTPSecretsManager,
        configService: ConfigService
    ) {
        super(repository, secretManager, configService);
    }

    protected canIssueCode(): boolean {
        return true;
    }

    protected async onCodeIssued(user: User, code: string): Promise<void> {
        await this.publisher.onTOTPIssued(user.id, {
            account: { id: user.id },
            code,
        });
    }

    protected async onMethodCreated(user: User, provider: TOTP): Promise<void> {
        const code = provider.generate();
        await this.onCodeIssued(user, code);
    }

    protected get2FAMethod(): TwoFactorAuthenticationMethod {
        return TwoFactorAuthenticationMethod.EMAIL;
    }

    protected getTOTPDefaultTimeToLive(): number {
        return 60;
    }
}
