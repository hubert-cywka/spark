import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Transactional } from "@nestjs-cls/transactional";

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
import { RegisterWithCredentialsDto } from "@/modules/identity/authentication/dto/incoming/RegisterWithCredentials.dto";
import { type IAuthenticationService } from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import {
    type IAuthPublisherService,
    AuthPublisherServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";
import {
    type IRefreshTokenService,
    RefreshTokenServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";
import { type AccessTokenPayload, type AuthenticationResult } from "@/modules/identity/authentication/types/Authentication";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

// TODO: Consider using Keycloak (or other auth provider)
@Injectable()
export class AuthenticationService implements IAuthenticationService {
    private readonly accessTokenSigningSecret: string;
    private readonly accessTokenExpirationTimeInSeconds: number;

    constructor(
        configService: ConfigService,
        private jwtService: JwtService,
        @Inject(ManagedAccountServiceToken)
        private accountService: IManagedAccountService,
        @Inject(FederatedAccountServiceToken)
        private externalAccountService: IFederatedAccountService,
        @Inject(RefreshTokenServiceToken)
        private refreshTokenService: IRefreshTokenService,
        @Inject(AuthPublisherServiceToken)
        private publisher: IAuthPublisherService
    ) {
        this.accessTokenSigningSecret = configService.getOrThrow<string>("modules.identity.jwt.signingSecret");
        this.accessTokenExpirationTimeInSeconds = configService.getOrThrow<number>("modules.identity.jwt.expirationTimeInSeconds");
    }

    public async loginWithCredentials(email: string, password: string, withSudoMode?: boolean): Promise<AuthenticationResult> {
        const account = await this.accountService.findActivatedByCredentials(email, password);
        return await this.createAuthenticationResult({
            ...account,
            sudoMode: !!withSudoMode,
        });
    }

    @Transactional(IDENTITY_MODULE_DATA_SOURCE)
    public async registerWithCredentials({ email, password, lastName, firstName }: RegisterWithCredentialsDto): Promise<void> {
        const account = await this.accountService.createAccountWithCredentials(email, password);
        await this.publisher.onAccountRegistered(account.id, {
            account: {
                firstName,
                lastName,
                email,
                id: account.id,
                isActivated: false,
            },
        });
        await this.accountService.requestActivation(email);
    }

    public async loginWithExternalIdentity(identity: ExternalIdentity, withSudoMode?: boolean): Promise<AuthenticationResult> {
        const account = await this.externalAccountService.findByExternalIdentity(identity);
        return await this.createAuthenticationResult({
            ...account,
            sudoMode: !!withSudoMode,
        });
    }

    @Transactional(IDENTITY_MODULE_DATA_SOURCE)
    public async registerWithExternalIdentity(identity: ExternalIdentity): Promise<AuthenticationResult> {
        const account = await this.externalAccountService.createAccountWithExternalIdentity(identity);
        const { firstName, lastName, email } = identity;

        await this.publisher.onAccountRegistered(account.id, {
            account: {
                firstName,
                lastName,
                email,
                id: account.id,
                isActivated: true,
            },
        });
        return await this.createAuthenticationResult(account);
    }

    public async redeemRefreshToken(refreshToken: string): Promise<AuthenticationResult> {
        const { account } = await this.refreshTokenService.redeem(refreshToken);
        return await this.createAuthenticationResult({
            ...account,
            sudoMode: false,
        });
    }

    public async logout(refreshToken: string): Promise<void> {
        return this.refreshTokenService.invalidate(refreshToken);
    }

    private async createAuthenticationResult(account: Account): Promise<AuthenticationResult> {
        const tokens = await this.generateTokens(account);
        return { ...tokens, account };
    }

    private async generateTokens(account: Account): Promise<{ accessToken: string; refreshToken: string }> {
        const payload: AccessTokenPayload = {
            account,
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
