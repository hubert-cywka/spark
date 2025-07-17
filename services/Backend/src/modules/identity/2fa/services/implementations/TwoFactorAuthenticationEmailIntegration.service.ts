import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { TOTP } from "otpauth";
import { Repository } from "typeorm";

import { TwoFactorAuthenticationIntegrationEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationIntegration.entity";
import { TwoFactorAuthenticationIntegrationService } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationIntegration.service";
import {
    type ITwoFactorAuthenticationEmailIntegrationPublisherService,
    TwoFactorAuthenticationEmailIntegrationPublisherServiceToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationEmailIntegrationPublisher.service";
import { type ITwoFactorAuthenticationIntegrationService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationIntegration.service";
import {
    type ITwoFactorAuthenticationSecretManager,
    TwoFactorAuthenticationSecretManagerToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationSecretManager.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { type User } from "@/types/User";

@Injectable()
export class TwoFactorAuthenticationEmailIntegrationService
    extends TwoFactorAuthenticationIntegrationService
    implements ITwoFactorAuthenticationIntegrationService
{
    constructor(
        @InjectRepository(TwoFactorAuthenticationIntegrationEntity, IDENTITY_MODULE_DATA_SOURCE)
        repository: Repository<TwoFactorAuthenticationIntegrationEntity>,
        @Inject(TwoFactorAuthenticationEmailIntegrationPublisherServiceToken)
        private readonly publisher: ITwoFactorAuthenticationEmailIntegrationPublisherService,
        @Inject(TwoFactorAuthenticationSecretManagerToken)
        secretManager: ITwoFactorAuthenticationSecretManager,
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
