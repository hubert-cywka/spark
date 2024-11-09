export type GoogleAuthorizationMeans = {
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

export type GoogleAuthorizationResponse = {
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
};
