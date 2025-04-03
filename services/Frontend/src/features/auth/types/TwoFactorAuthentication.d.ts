export type TwoFactorAuthenticationMethod = "email" | "app";

export type TwoFactorAuthenticationOption = {
    method: TwoFactorAuthenticationMethod;
    enabledAt: Date;
};
