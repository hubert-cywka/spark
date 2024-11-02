import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { Account } from "@/modules/identity/account/models/Account.model";
import { IAccountService, IAccountServiceToken } from "@/modules/identity/account/services/interfaces/IAccount.service";
import { CURRENT_JWT_VERSION } from "@/modules/identity/authentication/constants";
import { LoginDto } from "@/modules/identity/authentication/dto/Login.dto";
import { RegisterDto } from "@/modules/identity/authentication/dto/Register.dto";
import { IAuthenticationService } from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import {
    IAuthPublisherService,
    IAuthPublisherServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";
import {
    IRefreshTokenService,
    IRefreshTokenServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";
import { AccessTokenPayload } from "@/modules/identity/authentication/types/accessTokenPayload";
import { AuthenticationResult } from "@/modules/identity/authentication/types/authenticationResult";

// TODO: Consider using Keycloak (or other auth provider)
@Injectable()
export class AuthenticationService implements IAuthenticationService {
    private readonly accessTokenSigningSecret: string;
    private readonly accessTokenExpirationTimeInSeconds: number;

    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        @Inject(IAccountServiceToken)
        private accountService: IAccountService,
        @Inject(IRefreshTokenServiceToken)
        private refreshTokenService: IRefreshTokenService,
        @Inject(IAuthPublisherServiceToken)
        private publisher: IAuthPublisherService
    ) {
        this.accessTokenSigningSecret = configService.getOrThrow<string>("modules.auth.jwt.signingSecret");
        this.accessTokenExpirationTimeInSeconds = configService.getOrThrow<number>("modules.auth.jwt.expirationTimeInSeconds");
    }

    public async getIdentityFromAccessToken(accessToken: string): Promise<Account> {
        const { id, email } = await this.jwtService.decode(accessToken);
        return { id, email };
    }

    public async login({ email, password }: LoginDto): Promise<AuthenticationResult> {
        const { id } = await this.accountService.findByCredentials(email, password);
        return await this.generateTokens({ id, email });
    }

    public async redeemRefreshToken(refreshToken: string): Promise<AuthenticationResult> {
        const { id, email } = await this.refreshTokenService.redeem(refreshToken);
        return await this.generateTokens({ id, email });
    }

    public async register({ email, password, lastName, firstName }: RegisterDto): Promise<void> {
        const user = await this.accountService.save(email, password);
        this.publisher.onAccountRegistered({ ...user, firstName, lastName });
        await this.accountService.requestActivation(email);
    }

    public async logout(refreshToken: string): Promise<void> {
        return this.refreshTokenService.invalidate(refreshToken);
    }

    private async generateTokens(account: Account): Promise<{ accessToken: string; refreshToken: string }> {
        const payload: AccessTokenPayload = {
            ...account,
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
