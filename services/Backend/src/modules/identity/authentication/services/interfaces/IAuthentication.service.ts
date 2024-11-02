import { Account } from "@/modules/identity/account/models/Account.model";
import { LoginDto } from "@/modules/identity/authentication/dto/Login.dto";
import { RegisterDto } from "@/modules/identity/authentication/dto/Register.dto";
import { AuthenticationResult } from "@/modules/identity/authentication/types/authenticationResult";

export const IAuthServiceToken = Symbol("IAuthService");

export interface IAuthenticationService {
    login(loginDto: LoginDto): Promise<AuthenticationResult>;
    getIdentityFromAccessToken(accessToken: string): Promise<Account>;
    redeemRefreshToken(refreshToken: string): Promise<AuthenticationResult>;
    logout(refreshToken: string): Promise<void>;
    register(registerDto: RegisterDto): Promise<void>;
}
