import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { VariantNotSupportedError } from "@/modules/identity/account/errors/VariantNotSupported.error";
import { AccountActivationTokenService } from "@/modules/identity/account/services/implementations/AccountActivationTokenService";
import { PasswordResetTokenService } from "@/modules/identity/account/services/implementations/PasswordResetTokenService";
import { type ISingleUseTokenServiceFactory } from "@/modules/identity/account/services/interfaces/ISingelUseTokenService.factory";
import { type ISingleUseTokenService } from "@/modules/identity/account/services/interfaces/ISingleUseTokenService";
import { type SingleUseTokenType } from "@/modules/identity/account/types/SingleUseToken";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class SingleUseTokenServiceFactory implements ISingleUseTokenServiceFactory {
    private readonly logger = new Logger(SingleUseTokenServiceFactory.name);

    public constructor(
        @InjectRepository(SingleUseTokenEntity, IDENTITY_MODULE_DATA_SOURCE)
        private readonly repository: Repository<SingleUseTokenEntity>
    ) {}

    public create(variant: SingleUseTokenType): ISingleUseTokenService {
        switch (variant) {
            case "accountActivation":
                return new AccountActivationTokenService(this.repository);
            case "passwordChange":
                return new PasswordResetTokenService(this.repository);
            default:
                this.logger.error({ variant }, "Unsupported variant of single use token service.");
                throw new VariantNotSupportedError(variant);
        }
    }
}
