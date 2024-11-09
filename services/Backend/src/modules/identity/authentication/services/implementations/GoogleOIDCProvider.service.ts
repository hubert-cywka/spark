import type { OnModuleInit } from "@nestjs/common";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { decodeIdToken, generateCodeVerifier, generateState, Google } from "arctic";

import { type IGoogleOIDCProviderService } from "@/modules/identity/authentication/services/interfaces/IGoogleOIDCProvider.service";
import type {
    ExternalIdentity,
    GoogleAuthorizationMeans,
    GoogleAuthorizationResponse,
    GoogleClaims,
} from "@/modules/identity/authentication/types/OpenIDConnect";

@Injectable()
export class GoogleOIDCProviderService implements IGoogleOIDCProviderService, OnModuleInit {
    private readonly logger: Logger;
    private provider!: Google;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(GoogleOIDCProviderService.name);
    }

    async onModuleInit() {
        const clientId = this.configService.getOrThrow<string>("modules.auth.oidc.google.clientId");
        const clientSecret = this.configService.getOrThrow<string>("modules.auth.oidc.google.clientSecret");
        const redirectUrl = this.configService.getOrThrow<string>("modules.auth.oidc.google.redirectUrl");

        this.provider = new Google(clientId, clientSecret, redirectUrl);
    }

    public startAuthorizationProcess(): GoogleAuthorizationMeans {
        const scopes = ["openid", "profile", "email"];
        const state = generateState();
        const codeVerifier = generateCodeVerifier();
        const url = this.provider.createAuthorizationURL(state, codeVerifier, scopes);

        return { state, codeVerifier, url };
    }

    public validateAuthorizationResponse({ code, storedState, state, storedCodeVerifier }: GoogleAuthorizationResponse): boolean {
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
        };
    }
}
