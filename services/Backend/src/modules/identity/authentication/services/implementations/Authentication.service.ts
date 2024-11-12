import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import type { Account } from "@/modules/identity/account/models/Account.model";
import {
    type IFederatedAccountService,
    IFederatedAccountServiceToken,
} from "@/modules/identity/account/services/interfaces/IFederatedAccount.service";
import {
    type IManagedAccountService,
    IManagedAccountServiceToken,
} from "@/modules/identity/account/services/interfaces/IManagedAccount.service";
import { CURRENT_JWT_VERSION } from "@/modules/identity/authentication/constants";
import type { LoginDto } from "@/modules/identity/authentication/dto/Login.dto";
import type { RegisterWithCredentialsDto } from "@/modules/identity/authentication/dto/RegisterWithCredentials.dto";
import { type IAuthenticationService } from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import {
    type IAuthPublisherService,
    IAuthPublisherServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";
import {
    type IRefreshTokenService,
    IRefreshTokenServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";
import { type AccessTokenPayload, type AuthenticationResult } from "@/modules/identity/authentication/types/Authentication";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

// TODO: Consider using Keycloak (or other auth provider)
@Injectable()
export class AuthenticationService implements IAuthenticationService {
    private readonly accessTokenSigningSecret: string;
    private readonly accessTokenExpirationTimeInSeconds: number;

    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        @Inject(IManagedAccountServiceToken)
        private accountService: IManagedAccountService,
        @Inject(IFederatedAccountServiceToken)
        private externalAccountService: IFederatedAccountService,
        @Inject(IRefreshTokenServiceToken)
        private refreshTokenService: IRefreshTokenService,
        @Inject(IAuthPublisherServiceToken)
        private publisher: IAuthPublisherService
    ) {
        this.accessTokenSigningSecret = configService.getOrThrow<string>("modules.auth.jwt.signingSecret");
        this.accessTokenExpirationTimeInSeconds = configService.getOrThrow<number>("modules.auth.jwt.expirationTimeInSeconds");
    }

    public async loginWithCredentials({ email, password }: LoginDto): Promise<AuthenticationResult> {
        const account = await this.accountService.findActivatedByCredentials(email, password);
        return await this.createAuthenticationResult(account);
    }

    public async registerWithCredentials({ email, password, lastName, firstName }: RegisterWithCredentialsDto): Promise<void> {
        const account = await this.accountService.createAccountWithCredentials(email, password);
        this.publisher.onAccountRegistered({
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

    public async loginWithExternalIdentity(
        identity: ExternalIdentity,
        providerId: FederatedAccountProvider
    ): Promise<AuthenticationResult> {
        const account = await this.externalAccountService.findByExternalIdentity(identity, providerId);
        return await this.createAuthenticationResult(account);
    }

    public async registerWithExternalIdentity(
        identity: ExternalIdentity,
        providerId: FederatedAccountProvider
    ): Promise<AuthenticationResult> {
        const account = await this.externalAccountService.createAccountWithExternalIdentity(identity, providerId);
        const { firstName, lastName, email } = identity;

        this.publisher.onAccountRegistered({
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
        return await this.createAuthenticationResult(account);
    }

    public async logout(refreshToken: string): Promise<void> {
        return this.refreshTokenService.invalidate(refreshToken);
    }

    private async createAuthenticationResult(account: Account): Promise<AuthenticationResult> {
        const tokens = await this.generateTokens(account);
        return { ...tokens, account };
    }

    private async generateTokens(account: Account): Promise<{ accessToken: string; refreshToken: string }> {
        console.log("\n\n", account, "\n\n");

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
