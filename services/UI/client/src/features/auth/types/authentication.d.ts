export type LoginRequestPayload = {
    email: string;
    password: string;
};

export type LoginRequestResponse = {
    accessToken: string;
};

export type RefreshTokenRequestResponse = {
    accessToken: string;
};

export type RegisterRequestPayload = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    hasAcceptedTermsAndConditions: boolean;
};

export type UpdatePasswordResetRequestPayload = {
    password: string;
    passwordChangeToken: string;
};

export type RequestPasswordResetRequestPayload = {
    email: string;
};

export type RequestActivationTokenRequestPayload = {
    email: string;
};

export type ActivateAccountRequestPayload = {
    activationToken: string;
};
