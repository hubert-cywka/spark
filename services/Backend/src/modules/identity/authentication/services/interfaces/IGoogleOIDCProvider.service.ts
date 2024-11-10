import {
    type ExternalIdentity,
    type GoogleAuthorizationMeans,
    type GoogleAuthorizationResponse,
} from "@/modules/identity/authentication/types/OpenIDConnect";

export const IGoogleOIDCProviderServiceToken = Symbol("IGoogleOIDCProviderService");

// Hubert: Right now only one external provider is supported, therefore there is no need for further abstraction, OIDC
// providers do not need to be interchangeable.
export interface IGoogleOIDCProviderService {
    startAuthorizationProcess: () => GoogleAuthorizationMeans;
    validateAuthorizationResponse: (response: GoogleAuthorizationResponse) => boolean;
    validateExternalIdentity: (identity: ExternalIdentity) => boolean;
    getIdentity: (code: string, codeVerifier: string) => Promise<ExternalIdentity>;
}
