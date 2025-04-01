import { User } from "@/types/User";

export const TwoFactorAuthenticationServiceToken = Symbol("TwoFactorAuthenticationService");

export interface ITwoFactorAuthenticationService {
    verifyCode(user: User, code: string): Promise<boolean>;
    issueCode(user: User): Promise<void>;

    confirmMethod(user: User, code: string): Promise<boolean>;
    createMethod(user: User): Promise<string>;
    deleteMethod(user: User): Promise<void>;
}
