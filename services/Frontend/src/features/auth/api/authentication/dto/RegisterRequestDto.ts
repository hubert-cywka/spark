export type RegisterRequestDto = {
    email: string;
    password: string;
    hasAcceptedTermsAndConditions: boolean;
    accountActivationRedirectUrl: string;
};
