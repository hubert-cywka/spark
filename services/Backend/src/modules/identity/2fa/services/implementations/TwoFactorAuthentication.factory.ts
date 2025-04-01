import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

import { Unsupported2FAMethodError } from "@/modules/identity/2fa/errors/Unsupported2FAMethod.error";
import { TwoFactorAuthenticationAppService } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationApp.service";
import { TwoFactorAuthenticationEmailService } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationEmail.service";
import { ITwoFactorAuthenticationFactory } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthentication.factory";
import { ITwoFactorAuthenticationService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthentication.service";
import {
    type ITwoFactorAuthenticationPublisherService,
    TwoFactorAuthenticationPublisherServiceToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationPublisher.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class TwoFactorAuthenticationFactory implements ITwoFactorAuthenticationFactory {
    private readonly logger = new Logger(TwoFactorAuthenticationFactory.name);

    constructor(
        @InjectTransactionHost(IDENTITY_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(TwoFactorAuthenticationPublisherServiceToken)
        private readonly publisher: ITwoFactorAuthenticationPublisherService
    ) {}

    public create(method: TwoFactorAuthenticationMethod): ITwoFactorAuthenticationService {
        switch (method) {
            case TwoFactorAuthenticationMethod.AUTHENTICATOR:
                return new TwoFactorAuthenticationAppService(this.txHost);
            case TwoFactorAuthenticationMethod.EMAIL:
                return new TwoFactorAuthenticationEmailService(this.txHost, this.publisher);
            default:
                this.logger.error({ method }, "Unsupported 2FA method.");
                throw new Unsupported2FAMethodError(method);
        }
    }
}
