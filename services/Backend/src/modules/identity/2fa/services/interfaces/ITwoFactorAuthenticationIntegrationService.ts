import { User } from "@/types/User";

export const TwoFactorAuthenticationIntegrationServiceToken = Symbol("TwoFactorAuthenticationIntegrationService");

export interface ITwoFactorAuthenticationIntegrationService {
    validateTOTP(user: User, code: string): Promise<boolean>;
    issueTOTP(user: User): Promise<void>;

    confirmMethodIntegration(user: User, code: string): Promise<boolean>;
    createMethodIntegration(user: User): Promise<string>;
    deleteMethodIntegration(user: User): Promise<void>;
}
