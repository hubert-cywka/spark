import {
    type ExternalIdentity,
    type GoogleAuthorizationMeans,
    type GoogleAuthorizationResponse,
} from "@/modules/identity/authentication/types/OpenIDConnect";

export const IGoogleOIDCProviderServiceToken = Symbol("IGoogleOIDCProviderService");

export interface IGoogleOIDCProviderService {
    startAuthorizationProcess: () => GoogleAuthorizationMeans;
    validateAuthorizationResponse: (response: GoogleAuthorizationResponse) => boolean;
    validateExternalIdentity: (identity: ExternalIdentity) => boolean;
    getIdentity: (code: string, codeVerifier: string) => Promise<ExternalIdentity>;
}
