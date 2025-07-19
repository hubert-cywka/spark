import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { UnsupportedOIDCProviderError } from "@/modules/identity/authentication/errors/UnsupportedOIDCProvider.error";
import { GoogleOIDCProvider } from "@/modules/identity/authentication/services/implementations/GoogleOIDCProvider.service";
import { type IOIDCProviderFactory } from "@/modules/identity/authentication/services/interfaces/IOIDCProvider.factory";
import { type IOIDCProvider } from "@/modules/identity/authentication/services/interfaces/IOIDCProvider.service";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

@Injectable()
export class OIDCProviderFactory implements IOIDCProviderFactory {
    private readonly logger = new Logger(OIDCProviderFactory.name);

    constructor(private readonly configService: ConfigService) {}

    public create(providerId: FederatedAccountProvider): IOIDCProvider {
        // eslint-disable-next-line sonarjs/no-small-switch
        switch (providerId) {
            case FederatedAccountProvider.GOOGLE:
                return new GoogleOIDCProvider(this.configService);
            default:
                this.logger.error({ providerId }, "Unsupported OIDC provider.");
                throw new UnsupportedOIDCProviderError(providerId);
        }
    }
}
