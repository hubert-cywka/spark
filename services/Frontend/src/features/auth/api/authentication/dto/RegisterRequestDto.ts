export type RegisterRequestDto = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    hasAcceptedTermsAndConditions: boolean;
    accountActivationRedirectUrl: string;
};
