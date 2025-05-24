import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TwoFactorAuthenticationIntegrationEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationIntegration.entity";
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
        @InjectRepository(TwoFactorAuthenticationIntegrationEntity, IDENTITY_MODULE_DATA_SOURCE)
        repository: Repository<TwoFactorAuthenticationIntegrationEntity>,
        configService: ConfigService
    ) {
        super(repository, configService);
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
