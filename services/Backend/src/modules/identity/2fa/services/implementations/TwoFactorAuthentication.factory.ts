import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

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
        @InjectTransactionHost(IDENTITY_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(TwoFactorAuthenticationEmailIntegrationPublisherServiceToken)
        private readonly publisher: ITwoFactorAuthenticationEmailIntegrationPublisherService
    ) {}

    public createIntegrationService(method: TwoFactorAuthenticationMethod): ITwoFactorAuthenticationIntegrationService {
        switch (method) {
            case TwoFactorAuthenticationMethod.AUTHENTICATOR:
                return new TwoFactorAuthenticationAppIntegrationService(this.txHost);
            case TwoFactorAuthenticationMethod.EMAIL:
                return new TwoFactorAuthenticationEmailIntegrationService(this.txHost, this.publisher);
            default:
                this.logger.error({ method }, "Unsupported 2FA method.");
                throw new IntegrationMethodNotSupportedError(method);
        }
    }
}
