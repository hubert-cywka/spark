import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TwoFactorAuthenticationIntegrationEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationIntegration.entity";
import { IntegrationMethodNotSupportedError } from "@/modules/identity/2fa/errors/IntegrationMethodNotSupported.error";
import { TwoFactorAuthenticationAppIntegrationService } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationAppIntegration.service";
import { TwoFactorAuthenticationEmailIntegrationService } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationEmailIntegration.service";
import { type ITwoFactorAuthenticationFactory } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthentication.factory";
import {
    type ITwoFactorAuthenticationEmailIntegrationPublisherService,
    TwoFactorAuthenticationEmailIntegrationPublisherServiceToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationEmailIntegrationPublisher.service";
import { type ITwoFactorAuthenticationIntegrationService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationIntegration.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class TwoFactorAuthenticationFactory implements ITwoFactorAuthenticationFactory {
    private readonly logger = new Logger(TwoFactorAuthenticationFactory.name);

    constructor(
        @InjectRepository(TwoFactorAuthenticationIntegrationEntity, IDENTITY_MODULE_DATA_SOURCE)
        private readonly repository: Repository<TwoFactorAuthenticationIntegrationEntity>,
        @Inject(TwoFactorAuthenticationEmailIntegrationPublisherServiceToken)
        private readonly publisher: ITwoFactorAuthenticationEmailIntegrationPublisherService,
        private readonly configService: ConfigService
    ) {}

    public createIntegrationService(method: TwoFactorAuthenticationMethod): ITwoFactorAuthenticationIntegrationService {
        switch (method) {
            case TwoFactorAuthenticationMethod.AUTHENTICATOR:
                return new TwoFactorAuthenticationAppIntegrationService(this.repository, this.configService);
            case TwoFactorAuthenticationMethod.EMAIL:
                return new TwoFactorAuthenticationEmailIntegrationService(this.repository, this.publisher, this.configService);
            default:
                this.logger.error({ method }, "Unsupported 2FA method.");
                throw new IntegrationMethodNotSupportedError(method);
        }
    }
}
