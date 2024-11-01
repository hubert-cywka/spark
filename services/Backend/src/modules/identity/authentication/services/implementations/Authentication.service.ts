import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { IAccountService, IAccountServiceToken } from "@/modules/identity/account/services/interfaces/IAccountService";
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
import { AuthenticationResult } from "@/modules/identity/authentication/types/authenticationResult";

// TODO: Consider using Keycloak (or other auth provider)
@Injectable()
export class AuthenticationService implements IAuthenticationService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        @Inject(IAccountServiceToken)
        private accountService: IAccountService,
        @Inject(IRefreshTokenServiceToken)
        private refreshTokenService: IRefreshTokenService,
        @Inject(IAuthPublisherServiceToken)
        private publisher: IAuthPublisherService
    ) {}

    public async login({ email, password }: LoginDto): Promise<AuthenticationResult> {
        const { id } = await this.accountService.findByCredentials(email, password);
        return await this.generateTokens(id);
    }

    public async redeemRefreshToken(refreshToken: string): Promise<AuthenticationResult> {
        const { id } = await this.refreshTokenService.redeem(refreshToken);
        return await this.generateTokens(id);
    }

    public async register({ email, password, lastName, firstName }: RegisterDto): Promise<void> {
        const user = await this.accountService.save(email, password);
        this.publisher.onAccountRegistered({ ...user, firstName, lastName });
        await this.accountService.requestActivation(email);
    }

    public async logout(refreshToken: string): Promise<void> {
        return this.refreshTokenService.invalidate(refreshToken);
    }

    private async generateTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = { id: userId, ver: CURRENT_JWT_VERSION };
        const secret = this.configService.getOrThrow<string>("modules.auth.jwt.signingSecret");
        const expiresIn = this.configService.getOrThrow<number>("modules.auth.jwt.expirationTimeInSeconds");

        const accessToken = await this.jwtService.signAsync(payload, {
            secret,
            expiresIn,
        });

        const refreshToken = await this.refreshTokenService.sign(payload);

        return { accessToken, refreshToken };
    }
}
