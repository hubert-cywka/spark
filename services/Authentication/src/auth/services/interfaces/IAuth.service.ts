import { AuthenticationResult } from "@/auth/types/authenticationResult";

export const IAuthServiceToken = Symbol("IAuthService");

export interface IAuthService {
    login(email: string, password: string): Promise<AuthenticationResult>;
    useRefreshToken(refreshToken: string): Promise<AuthenticationResult>;
    logout(refreshToken: string): Promise<void>;
    register(email: string, password: string): Promise<void>;
    confirmRegistration(activationToken: string): Promise<AuthenticationResult>;
}
