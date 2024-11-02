export type AuthenticationResponse = {
    email: string;
    id: string;
    accessToken: string;
};

export type LoginRequestPayload = {
    email: string;
    password: string;
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
