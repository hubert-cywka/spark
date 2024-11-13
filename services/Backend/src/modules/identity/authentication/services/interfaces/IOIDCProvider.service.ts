import {
    type ExternalIdentity,
    type OIDCAuthorizationMeans,
    type OIDCAuthorizationResponse,
} from "@/modules/identity/authentication/types/OpenIDConnect";

export const IOIDCProviderServiceToken = Symbol("IOIDCProviderService");

export interface IOIDCProviderService {
    startAuthorizationProcess: () => OIDCAuthorizationMeans;
    validateAuthorizationResponse: (response: OIDCAuthorizationResponse) => boolean;
    validateExternalIdentity: (identity: ExternalIdentity) => boolean;
    getIdentity: (code: string, codeVerifier: string) => Promise<ExternalIdentity>;
}
