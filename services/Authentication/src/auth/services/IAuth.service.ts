import { AuthenticationResult } from "@/auth/types/authenticationResult";

export const IAuthServiceToken = Symbol("IAuthService");

export interface IAuthService {
    loginWithCredentials(email: string, password: string): Promise<AuthenticationResult>;
    loginWithRefreshToken(refreshToken: string): Promise<AuthenticationResult>;
    register(email: string, password: string): Promise<AuthenticationResult>;
    logout(refreshToken: string): Promise<void>;
}
