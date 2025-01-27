import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { decodeIdToken, generateCodeVerifier, generateState, Google } from "arctic";

import { type IOIDCProviderService } from "@/modules/identity/authentication/services/interfaces/IOIDCProvider.service";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";
import type {
    ExternalIdentity,
    GoogleClaims,
    OIDCAuthorizationMeans,
    OIDCAuthorizationResponse,
} from "@/modules/identity/authentication/types/OpenIDConnect";

@Injectable()
export class GoogleOIDCProviderService implements IOIDCProviderService {
    private readonly logger: Logger;
    private provider: Google;

    constructor(private configService: ConfigService) {
        const clientId = this.configService.getOrThrow<string>("modules.identity.oidc.google.clientId");
        const clientSecret = this.configService.getOrThrow<string>("modules.identity.oidc.google.clientSecret");
        const redirectUrl = this.configService.getOrThrow<string>("modules.identity.oidc.google.redirectUrl");

        this.logger = new Logger(GoogleOIDCProviderService.name);
        this.provider = new Google(clientId, clientSecret, redirectUrl);
    }

    public startAuthorizationProcess(): OIDCAuthorizationMeans {
        const scopes = ["openid", "profile", "email"];
        const state = generateState();
        const codeVerifier = generateCodeVerifier();
        const url = this.provider.createAuthorizationURL(state, codeVerifier, scopes);

        return { state, codeVerifier, url };
    }

    public validateAuthorizationResponse({ code, storedState, state, storedCodeVerifier }: OIDCAuthorizationResponse): boolean {
        return !!code && !!storedState && state === storedState && !!storedCodeVerifier;
    }

    public validateExternalIdentity(identity: ExternalIdentity): boolean {
        return !!identity.id && !!identity.email && !!identity.firstName && !!identity.lastName;
    }

    public async getIdentity(code: string, codeVerifier: string): Promise<ExternalIdentity> {
        const tokens = await this.provider.validateAuthorizationCode(code, codeVerifier);
        const claims = decodeIdToken(tokens.idToken()) as GoogleClaims;
        return {
            firstName: claims.given_name,
            lastName: claims.family_name,
            email: claims.email,
            id: claims.sub,
            providerId: FederatedAccountProvider.GOOGLE,
        };
    }
}
