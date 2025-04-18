import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Transactional } from "@nestjs-cls/transactional";

import { type AccessScopes, AccessScope } from "@/common/types/AccessScope";
import type { Account } from "@/modules/identity/account/models/Account.model";
import {
    type IFederatedAccountService,
    FederatedAccountServiceToken,
} from "@/modules/identity/account/services/interfaces/IFederatedAccount.service";
import {
    type IManagedAccountService,
    ManagedAccountServiceToken,
} from "@/modules/identity/account/services/interfaces/IManagedAccount.service";
import { CURRENT_JWT_VERSION } from "@/modules/identity/authentication/constants";
import { InvalidAccessTokenError } from "@/modules/identity/authentication/errors/InvalidAccessToken.error";
import {
    type IAccessScopesService,
    AccessScopesServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAccessScopes.service";
import { type IAuthenticationService } from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import {
    type IAuthPublisherService,
    AuthPublisherServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";
import {
    type IRefreshTokenService,
    RefreshTokenServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";
import {
    type AccessTokenPayload,
    type AuthenticationResult,
    type Credentials,
    type PersonalInformation,
} from "@/modules/identity/authentication/types/Authentication";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

@Injectable()
export class AuthenticationService implements IAuthenticationService {
    private readonly logger = new Logger(AuthenticationService.name);
    private readonly accessTokenSigningSecret: string;
    private readonly accessTokenExpirationTimeInSeconds: number;

    constructor(
        configService: ConfigService,
        private jwtService: JwtService,
        @Inject(ManagedAccountServiceToken)
        private managedAccountService: IManagedAccountService,
        @Inject(FederatedAccountServiceToken)
        private federatedAccountService: IFederatedAccountService,
        @Inject(RefreshTokenServiceToken)
        private refreshTokenService: IRefreshTokenService,
        @Inject(AuthPublisherServiceToken)
        private publisher: IAuthPublisherService,
        @Inject(AccessScopesServiceToken)
        private scopesService: IAccessScopesService
    ) {
        this.accessTokenSigningSecret = configService.getOrThrow<string>("modules.identity.jwt.signingSecret");
        this.accessTokenExpirationTimeInSeconds = configService.getOrThrow<number>("modules.identity.jwt.expirationTimeInSeconds");
    }

    public async loginWithCredentials({ email, password }: Credentials): Promise<AuthenticationResult> {
        const account = await this.managedAccountService.findActivatedByCredentials(email, password);
        return await this.createAuthenticationResult(account, this.scopesService.getByAccountId(account.id));
    }

    @Transactional(IDENTITY_MODULE_DATA_SOURCE)
    public async registerWithCredentials(
        { email, password }: Credentials,
        { firstName, lastName }: PersonalInformation,
        clientRedirectUrl: string
    ): Promise<void> {
        const account = await this.managedAccountService.createAccountWithCredentials(email, password);

        await this.publisher.onAccountRegistered(account.id, {
            account: {
                firstName,
                lastName,
                email,
                id: account.id,
            },
        });

        await this.managedAccountService.requestActivation(email, clientRedirectUrl);
    }

    public async loginWithExternalIdentity(identity: ExternalIdentity): Promise<AuthenticationResult> {
        const account = await this.federatedAccountService.findByExternalIdentity(identity);
        return await this.createAuthenticationResult(account, this.scopesService.getByAccountId(account.id));
    }

    @Transactional(IDENTITY_MODULE_DATA_SOURCE)
    public async registerWithExternalIdentity(identity: ExternalIdentity): Promise<AuthenticationResult> {
        const account = await this.federatedAccountService.createAccountWithExternalIdentity(identity);
        const { firstName, lastName, email } = identity;

        await this.publisher.onAccountRegistered(account.id, {
            account: {
                firstName,
                lastName,
                email,
                id: account.id,
            },
        });

        await this.federatedAccountService.activateByInternalId(account.id);
        return await this.createAuthenticationResult(account, this.scopesService.getByAccountId(account.id));
    }

    public async redeemRefreshToken(refreshToken: string): Promise<AuthenticationResult> {
        const { account } = await this.refreshTokenService.redeem(refreshToken);
        return await this.createAuthenticationResult(account, this.scopesService.getByAccountId(account.id));
    }

    public async logout(refreshToken: string): Promise<void> {
        return this.refreshTokenService.invalidate(refreshToken);
    }

    // TODO: Invalidate refresh token before issuing new one
    public async upgradeAccessToken(accessToken: string, scopes: AccessScope[]): Promise<AuthenticationResult> {
        const payload: AccessTokenPayload | null = this.jwtService.decode(accessToken);

        if (!payload) {
            this.logger.warn("Invalid access token.");
            throw new InvalidAccessTokenError();
        }

        const upgradedScopes = this.scopesService.activate(payload.account.id, scopes);
        return this.createAuthenticationResult(payload.account, upgradedScopes);
    }

    private async createAuthenticationResult(account: Account, accessScopes: AccessScopes): Promise<AuthenticationResult> {
        const tokens = await this.generateTokens(account, accessScopes);
        return { ...tokens, account, accessScopes };
    }

    private async generateTokens(account: Account, accessScopes: AccessScopes): Promise<{ accessToken: string; refreshToken: string }> {
        const payload: AccessTokenPayload = {
            account,
            accessScopes,
            ver: CURRENT_JWT_VERSION,
        };

        const refreshToken = await this.refreshTokenService.issue(payload);
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.accessTokenSigningSecret,
            expiresIn: this.accessTokenExpirationTimeInSeconds,
        });

        return { accessToken, refreshToken };
    }
}
