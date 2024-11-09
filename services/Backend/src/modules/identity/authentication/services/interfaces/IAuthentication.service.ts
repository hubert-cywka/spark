import { type LoginDto } from "@/modules/identity/authentication/dto/Login.dto";
import { type RegisterWithCredentialsDto } from "@/modules/identity/authentication/dto/RegisterWithCredentials.dto";
import { type AccountProvider } from "@/modules/identity/authentication/types/AccountProvider";
import { type AuthenticationResult } from "@/modules/identity/authentication/types/Authentication";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

export const IAuthenticationServiceToken = Symbol("IAuthenticationService");

export interface IAuthenticationService {
    loginWithExternalIdentity(identity: ExternalIdentity, providerId: AccountProvider): Promise<AuthenticationResult>;
    registerWithExternalIdentity(identity: ExternalIdentity, providerId: AccountProvider): Promise<AuthenticationResult>;

    loginWithCredentials(loginDto: LoginDto): Promise<AuthenticationResult>;
    registerWithCredentials(registerDto: RegisterWithCredentialsDto): Promise<void>;

    redeemRefreshToken(refreshToken: string): Promise<AuthenticationResult>;
    logout(refreshToken: string): Promise<void>;
}
