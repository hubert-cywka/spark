export type TwoFactorAuthenticationMethod = "email" | "app";

export type TwoFactorAuthenticationIntegration = {
    method: TwoFactorAuthenticationMethod;
    enabledAt: Date;
};
