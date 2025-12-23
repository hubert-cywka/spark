import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TwoFactorAuthenticationIntegrationEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationIntegration.entity";
import { IntegrationMethodNotSupportedError } from "@/modules/identity/2fa/errors/IntegrationMethodNotSupported.error";
import { App2FAIntegrationService } from "@/modules/identity/2fa/services/implementations/App2FAIntegrationService";
import { Email2FAIntegrationService } from "@/modules/identity/2fa/services/implementations/Email2FAIntegrationService";
import { type ITOTPSecretsManager, TOTPSecretsManagerToken } from "@/modules/identity/2fa/services/interfaces/ITOTPSecretsManager";
import { type ITwoFactorAuthenticationFactory } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthentication.factory";
import {
    type ITwoFactorAuthenticationEventsPublisher,
    TwoFactorAuthenticationEventsPublisherToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationEventsPublisher";
import { type ITwoFactorAuthenticationIntegrationService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationIntegrationService";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class TwoFactorAuthenticationFactory implements ITwoFactorAuthenticationFactory {
    private readonly logger = new Logger(TwoFactorAuthenticationFactory.name);

    constructor(
        @InjectRepository(TwoFactorAuthenticationIntegrationEntity, IDENTITY_MODULE_DATA_SOURCE)
        private readonly repository: Repository<TwoFactorAuthenticationIntegrationEntity>,
        @Inject(TwoFactorAuthenticationEventsPublisherToken)
        private readonly publisher: ITwoFactorAuthenticationEventsPublisher,
        @Inject(TOTPSecretsManagerToken)
        private readonly secretManager: ITOTPSecretsManager,
        private readonly configService: ConfigService
    ) {}

    public createIntegrationService(method: TwoFactorAuthenticationMethod): ITwoFactorAuthenticationIntegrationService {
        switch (method) {
            case TwoFactorAuthenticationMethod.AUTHENTICATOR:
                return new App2FAIntegrationService(this.repository, this.secretManager, this.configService);
            case TwoFactorAuthenticationMethod.EMAIL:
                return new Email2FAIntegrationService(this.repository, this.publisher, this.secretManager, this.configService);
            default:
                this.logger.error({ method }, "Unsupported 2FA method.");
                throw new IntegrationMethodNotSupportedError(method);
        }
    }
}
