import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { GoogleOIDCProviderService } from "@/modules/identity/authentication/services/implementations/GoogleOIDCProvider.service";
import { type IOIDCProviderFactory } from "@/modules/identity/authentication/services/interfaces/IOIDCProvider.factory";
import { type IOIDCProviderService } from "@/modules/identity/authentication/services/interfaces/IOIDCProvider.service";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

@Injectable()
export class OIDCProviderFactory implements IOIDCProviderFactory {
    private readonly logger: Logger;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(OIDCProviderFactory.name);
    }

    public create(providerId: FederatedAccountProvider): IOIDCProviderService {
        // eslint-disable-next-line sonarjs/no-small-switch
        switch (providerId) {
            case FederatedAccountProvider.GOOGLE:
                return new GoogleOIDCProviderService(this.configService);
            default:
                this.logger.error({ providerId }, "Unsupported provider.");
                throw new Error(`Unsupported provider: ${providerId}`);
        }
    }
}
