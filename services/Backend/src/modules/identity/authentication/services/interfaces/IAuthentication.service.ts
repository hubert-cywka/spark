import { LoginDto } from "@/modules/identity/authentication/dto/incoming/Login.dto";
import { RegisterWithCredentialsDto } from "@/modules/identity/authentication/dto/incoming/RegisterWithCredentials.dto";
import { type AuthenticationResult } from "@/modules/identity/authentication/types/Authentication";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

export const AuthenticationServiceToken = Symbol("IAuthenticationService");

export interface IAuthenticationService {
    loginWithExternalIdentity(identity: ExternalIdentity): Promise<AuthenticationResult>;
    registerWithExternalIdentity(identity: ExternalIdentity): Promise<AuthenticationResult>;

    loginWithCredentials(loginDto: LoginDto): Promise<AuthenticationResult>;
    registerWithCredentials(registerDto: RegisterWithCredentialsDto): Promise<void>;

    redeemRefreshToken(refreshToken: string): Promise<AuthenticationResult>;
    logout(refreshToken: string): Promise<void>;
}
