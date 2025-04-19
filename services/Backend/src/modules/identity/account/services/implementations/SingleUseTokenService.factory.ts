import { Injectable, Logger } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

import { VariantNotSupportedError } from "@/modules/identity/account/errors/VariantNotSupported.error";
import { AccountActivationTokenService } from "@/modules/identity/account/services/implementations/AccountActivationToken.service";
import { PasswordResetTokenService } from "@/modules/identity/account/services/implementations/PasswordResetToken.service";
import { type ISingleUseTokenServiceFactory } from "@/modules/identity/account/services/interfaces/ISingelUseTokenService.factory";
import { type ISingleUseTokenService } from "@/modules/identity/account/services/interfaces/ISingleUseToken.service";
import { type SingleUseTokenType } from "@/modules/identity/account/types/SingleUseToken";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class SingleUseTokenServiceFactory implements ISingleUseTokenServiceFactory {
    private readonly logger = new Logger(SingleUseTokenServiceFactory.name);

    public constructor(
        @InjectTransactionHost(IDENTITY_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>
    ) {}

    public create(variant: SingleUseTokenType): ISingleUseTokenService {
        switch (variant) {
            case "accountActivation":
                return new AccountActivationTokenService(this.txHost);
            case "passwordChange":
                return new PasswordResetTokenService(this.txHost);
            default:
                this.logger.error({ variant }, "Unsupported variant of single use token service.");
                throw new VariantNotSupportedError(variant);
        }
    }
}
