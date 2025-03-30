import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

import { Unsupported2FAMethodError } from "@/modules/identity/authentication/errors/Unsupported2FAMethod.error";
import {
    type ITwoFactorAuthenticationOptionMapper,
    TwoFactorAuthenticationOptionMapperToken,
} from "@/modules/identity/authentication/mappers/ITwoFactorAuthenticationOption.mapper";
import { AuthenticatorApp2FAService } from "@/modules/identity/authentication/services/implementations/AuthenticatorApp2FA.service";
import { Email2FAService } from "@/modules/identity/authentication/services/implementations/Email2FA.service";
import { ITwoFactorAuthenticationFactory } from "@/modules/identity/authentication/services/interfaces/ITwoFactorAuthentication.factory";
import { ITwoFactorAuthenticationService } from "@/modules/identity/authentication/services/interfaces/ITwoFactorAuthentication.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/authentication/types/TwoFactorAuthenticationMethod";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class TwoFactorAuthenticationFactory implements ITwoFactorAuthenticationFactory {
    private readonly logger = new Logger(TwoFactorAuthenticationFactory.name);

    constructor(
        @InjectTransactionHost(IDENTITY_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(TwoFactorAuthenticationOptionMapperToken)
        private readonly twoFactorAuthMapper: ITwoFactorAuthenticationOptionMapper
    ) {}

    public create(method: TwoFactorAuthenticationMethod): ITwoFactorAuthenticationService {
        switch (method) {
            case TwoFactorAuthenticationMethod.AUTHENTICATOR:
                return new AuthenticatorApp2FAService(this.txHost, this.twoFactorAuthMapper);
            case TwoFactorAuthenticationMethod.EMAIL:
                return new Email2FAService(this.txHost, this.twoFactorAuthMapper);
            default:
                this.logger.error({ method }, "Unsupported 2FA method.");
                throw new Unsupported2FAMethodError(method);
        }
    }
}
