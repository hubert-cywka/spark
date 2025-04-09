import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

import { TwoFactorAuthenticationIntegrationService } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationIntegration.service";
import { type ITwoFactorAuthenticationIntegrationService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationIntegration.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class TwoFactorAuthenticationAppIntegrationService
    extends TwoFactorAuthenticationIntegrationService
    implements ITwoFactorAuthenticationIntegrationService
{
    constructor(
        @InjectTransactionHost(IDENTITY_MODULE_DATA_SOURCE)
        txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        configService: ConfigService
    ) {
        super(txHost, configService);
    }

    protected canIssueCode(): boolean {
        return false;
    }

    protected get2FAMethod(): TwoFactorAuthenticationMethod {
        return TwoFactorAuthenticationMethod.AUTHENTICATOR;
    }

    protected getTOTPDefaultTimeToLive(): number {
        return 30;
    }
}
