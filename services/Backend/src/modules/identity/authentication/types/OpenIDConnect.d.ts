import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

export type OIDCAuthorizationMeans = {
    url: URL;
    codeVerifier: string;
    state: string;
};

export type GoogleClaims = {
    given_name: string;
    family_name: string;
    email: string;
    sub: string;
};

export type OIDCAuthorizationResponse = {
    code: string;
    state: string;
    storedState: string;
    storedCodeVerifier: string;
};

export type ExternalIdentity = {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    providerId: FederatedAccountProvider;
};

export type OIDCAuthorizationOptions = {
    enableSudo?: boolean;
    targetAccountEmail?: string;
    loginRedirectUrl: string;
    registerRedirectUrl: string;
};
