import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { decodeIdToken, generateCodeVerifier, generateState, Google } from "arctic";

import { type IOIDCProvider } from "@/modules/identity/authentication/services/interfaces/IOIDCProvider.service";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";
import {
    ExternalIdentity,
    GoogleClaims,
    OIDCAuthorizationMeans,
    OIDCAuthorizationOptions,
    OIDCAuthorizationResponse,
} from "@/modules/identity/authentication/types/OpenIDConnect";

const SELECT_ACCOUNT_PROMPT = "select_account";
const CONSENT_PROMPT = "consent";

@Injectable()
export class GoogleOIDCProvider implements IOIDCProvider {
    private readonly logger = new Logger(GoogleOIDCProvider.name);
    private provider: Google;

    constructor(private configService: ConfigService) {
        const clientId = this.configService.getOrThrow<string>("modules.identity.oidc.google.clientId");
        const clientSecret = this.configService.getOrThrow<string>("modules.identity.oidc.google.clientSecret");
        const redirectUrl = this.configService.getOrThrow<string>("modules.identity.oidc.google.redirectUrl");

        this.provider = new Google(clientId, clientSecret, redirectUrl);
    }

    public startAuthorizationProcess({
        targetAccountEmail,
        loginRedirectUrl,
        registerRedirectUrl,
    }: OIDCAuthorizationOptions): OIDCAuthorizationMeans {
        const scopes = ["openid", "profile", "email"];
        const rawState = {
            state: generateState(),
            loginRedirectUrl,
            registerRedirectUrl,
        };

        const codeVerifier = generateCodeVerifier();
        const encodedState = Buffer.from(JSON.stringify(rawState)).toString("base64");
        const url = this.provider.createAuthorizationURL(encodedState, codeVerifier, scopes);

        url.searchParams.set("prompt", SELECT_ACCOUNT_PROMPT);

        if (targetAccountEmail) {
            url.searchParams.set("login_hint", targetAccountEmail);
        }

        return { state: encodedState, codeVerifier, url };
    }

    public validateAuthorizationResponse({
        code,
        storedState,
        state,
        storedCodeVerifier,
    }: OIDCAuthorizationResponse): OIDCAuthorizationOptions | null {
        let decodedStoredState;

        try {
            decodedStoredState = JSON.parse(Buffer.from(storedState, "base64").toString("utf-8"));
        } catch (error) {
            return null;
        }

        const isValid = !!code && !!storedState && state === storedState && !!storedCodeVerifier;

        if (isValid) {
            return decodedStoredState;
        } else {
            return null;
        }
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
