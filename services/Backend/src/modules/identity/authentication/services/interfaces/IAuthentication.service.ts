import { AccessScope } from "@/common/types/AccessScope";
import {
    type AuthenticationResult,
    type Credentials,
    type PersonalInformation,
} from "@/modules/identity/authentication/types/Authentication";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

export const AuthenticationServiceToken = Symbol("IAuthenticationService");

export interface IAuthenticationService {
    registerWithExternalIdentity(identity: ExternalIdentity): Promise<AuthenticationResult>;
    loginWithExternalIdentity(identity: ExternalIdentity): Promise<AuthenticationResult>;

    registerWithCredentials(credentials: Credentials, personalInformation: PersonalInformation): Promise<void>;
    loginWithCredentials(credentials: Credentials): Promise<AuthenticationResult>;

    redeemRefreshToken(refreshToken: string): Promise<AuthenticationResult>;
    logout(refreshToken: string): Promise<void>;

    upgradeAccessToken(accountId: string, scopes: AccessScope[]): Promise<AuthenticationResult>;
}
