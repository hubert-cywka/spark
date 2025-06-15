import { AccessScope } from "@/common/types/AccessScope";
import {
    type AuthenticationResult,
    type Credentials,
    type ExtendedAuthenticationResult,
} from "@/modules/identity/authentication/types/Authentication";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

export const AuthenticationServiceToken = Symbol("IAuthenticationService");

export interface IAuthenticationService {
    registerWithExternalIdentity(identity: ExternalIdentity): Promise<ExtendedAuthenticationResult>;
    loginWithExternalIdentity(identity: ExternalIdentity): Promise<ExtendedAuthenticationResult>;

    registerWithCredentials(credentials: Credentials, clientRedirectUrl: string): Promise<void>;
    loginWithCredentials(credentials: Credentials): Promise<ExtendedAuthenticationResult>;

    redeemRefreshToken(refreshToken: string): Promise<ExtendedAuthenticationResult>;
    logoutSingleSession(refreshToken: string): Promise<void>;
    logoutAllSessions(refreshToken: string): Promise<void>;

    upgradeAccessToken(accountId: string, scopes: AccessScope[]): Promise<AuthenticationResult>;
}
