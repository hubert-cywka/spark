import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { type AccessScopes, AccessScope } from "@/common/types/AccessScope";
import { type IAccountModuleFacade, AccountModuleFacadeToken } from "@/modules/identity/account/facade/IAccountModule.facade";
import type { Account } from "@/modules/identity/account/models/Account.model";
import { CURRENT_JWT_VERSION } from "@/modules/identity/authentication/constants";
import { InvalidAccessTokenError } from "@/modules/identity/authentication/errors/InvalidAccessToken.error";
import {
    type IAccessScopesService,
    AccessScopesServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAccessScopes.service";
import { type IAuthenticationService } from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import {
    type IRefreshTokenService,
    RefreshTokenServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";
import {
    type AccessTokenPayload,
    type AuthenticationResult,
    type Credentials,
    type ExtendedAuthenticationResult,
} from "@/modules/identity/authentication/types/Authentication";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

@Injectable()
export class AuthenticationService implements IAuthenticationService {
    private readonly logger = new Logger(AuthenticationService.name);
    private readonly accessTokenSigningSecret: string;
    private readonly accessTokenExpirationTimeInSeconds: number;

    constructor(
        configService: ConfigService,
        private jwtService: JwtService,
        @Inject(AccountModuleFacadeToken)
        private accountModule: IAccountModuleFacade,
        @Inject(RefreshTokenServiceToken)
        private refreshTokenService: IRefreshTokenService,
        @Inject(AccessScopesServiceToken)
        private scopesService: IAccessScopesService
    ) {
        this.accessTokenSigningSecret = configService.getOrThrow<string>("auth.jwt.signingSecret");
        this.accessTokenExpirationTimeInSeconds = configService.getOrThrow<number>("auth.jwt.expirationTimeInSeconds");
    }

    public async loginWithCredentials({ email, password }: Credentials): Promise<ExtendedAuthenticationResult> {
        const account = await this.accountModule.findManagedAccount(email, password);
        return await this.createAuthenticationResult(account, this.scopesService.getByAccountId(account.id), { includeRefreshToken: true });
    }

    public async registerWithCredentials({ email, password }: Credentials, clientRedirectUrl: string): Promise<void> {
        await this.accountModule.createManagedAccount(email, password, clientRedirectUrl);
    }

    public async loginWithExternalIdentity(identity: ExternalIdentity): Promise<ExtendedAuthenticationResult> {
        const account = await this.accountModule.findFederatedAccount(identity.id, identity.providerId);
        return await this.createAuthenticationResult(account, this.scopesService.getByAccountId(account.id), { includeRefreshToken: true });
    }

    public async registerWithExternalIdentity(identity: ExternalIdentity): Promise<ExtendedAuthenticationResult> {
        const account = await this.accountModule.createFederatedAccount(identity.id, identity.providerId, identity.email);
        return await this.createAuthenticationResult(account, this.scopesService.getByAccountId(account.id), { includeRefreshToken: true });
    }

    public async redeemRefreshToken(refreshToken: string): Promise<ExtendedAuthenticationResult> {
        const { account } = await this.refreshTokenService.redeem(refreshToken);
        return await this.createAuthenticationResult(account, this.scopesService.getByAccountId(account.id), { includeRefreshToken: true });
    }

    public async logoutSingleSession(refreshToken: string): Promise<void> {
        return this.refreshTokenService.invalidate(refreshToken);
    }

    public async logoutAllSessions(token: string): Promise<void> {
        const ownerId = await this.refreshTokenService.findOwner(token);
        return this.refreshTokenService.invalidateAllByOwnerId(ownerId);
    }

    public async upgradeAccessToken(accessToken: string, scopes: AccessScope[]): Promise<AuthenticationResult> {
        const payload: AccessTokenPayload | null = this.jwtService.decode(accessToken);

        if (!payload) {
            this.logger.warn("Invalid access token.");
            throw new InvalidAccessTokenError();
        }

        const upgradedScopes = this.scopesService.activate(payload.account.id, scopes);
        return this.createAuthenticationResult(payload.account, upgradedScopes, { includeRefreshToken: false });
    }

    private async createAuthenticationResult(
        account: Account,
        accessScopes: AccessScopes,
        options: { includeRefreshToken: true }
    ): Promise<ExtendedAuthenticationResult>;

    private async createAuthenticationResult(
        account: Account,
        accessScopes: AccessScopes,
        options: { includeRefreshToken?: false }
    ): Promise<AuthenticationResult>;

    private async createAuthenticationResult(account: Account, accessScopes: AccessScopes, options: CreateAuthenticationResultOptions) {
        const payload: AccessTokenPayload = {
            account,
            accessScopes,
            ver: CURRENT_JWT_VERSION,
        };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.accessTokenSigningSecret,
            expiresIn: this.accessTokenExpirationTimeInSeconds,
        });

        if (options.includeRefreshToken) {
            const refreshToken = await this.refreshTokenService.issue(payload);
            return { accessToken, refreshToken, accessScopes, account };
        } else {
            return { accessToken, accessScopes, account };
        }
    }
}

type CreateAuthenticationResultOptions = {
    includeRefreshToken?: boolean;
};
