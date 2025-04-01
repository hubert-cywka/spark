import { AccessScope } from "@/common/types/AccessScope";
import { RegisterWithCredentialsDto } from "@/modules/identity/authentication/dto/incoming/RegisterWithCredentials.dto";
import { type AuthenticationResult } from "@/modules/identity/authentication/types/Authentication";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

export const AuthenticationServiceToken = Symbol("IAuthenticationService");

export interface IAuthenticationService {
    registerWithExternalIdentity(identity: ExternalIdentity): Promise<AuthenticationResult>;
    loginWithExternalIdentity(identity: ExternalIdentity): Promise<AuthenticationResult>;

    // TODO: Remove DTO
    registerWithCredentials(registerDto: RegisterWithCredentialsDto): Promise<void>;
    loginWithCredentials(email: string, password: string): Promise<AuthenticationResult>;

    redeemRefreshToken(refreshToken: string): Promise<AuthenticationResult>;
    logout(refreshToken: string): Promise<void>;

    upgradeAccessToken(accountId: string, scopes: AccessScope[]): Promise<AuthenticationResult>;
}
