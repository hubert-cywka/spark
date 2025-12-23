import {
    type ExternalIdentity,
    type OIDCAuthorizationMeans,
    type OIDCAuthorizationResponse,
    OIDCAuthorizationOptions,
} from "@/modules/identity/authentication/types/OpenIDConnect";

export const OIDCProviderToken = Symbol("IOIDCProvider");

export interface IOIDCProvider {
    startAuthorizationProcess(options?: OIDCAuthorizationOptions): OIDCAuthorizationMeans;
    validateAuthorizationResponse(response: OIDCAuthorizationResponse): OIDCAuthorizationOptions | null;
    validateExternalIdentity(identity: ExternalIdentity): boolean;
    getIdentity(code: string, codeVerifier: string): Promise<ExternalIdentity>;
}
