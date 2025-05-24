import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { TOTP } from "otpauth";

import { TwoFactorAuthenticationIntegrationService } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationIntegration.service";
import {
    type ITwoFactorAuthenticationEmailIntegrationPublisherService,
    TwoFactorAuthenticationEmailIntegrationPublisherServiceToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationEmailIntegrationPublisher.service";
import { type ITwoFactorAuthenticationIntegrationService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationIntegration.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { type User } from "@/types/User";

@Injectable()
export class TwoFactorAuthenticationEmailIntegrationService
    extends TwoFactorAuthenticationIntegrationService
    implements ITwoFactorAuthenticationIntegrationService
{
    constructor(
        @InjectTransactionHost(IDENTITY_MODULE_DATA_SOURCE)
        txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(TwoFactorAuthenticationEmailIntegrationPublisherServiceToken)
        private readonly publisher: ITwoFactorAuthenticationEmailIntegrationPublisherService,
        configService: ConfigService
    ) {
        super(txHost, configService);
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
