import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { CURRENT_JWT_VERSION } from "@/auth/constants";
import { IAuthService } from "@/auth/services/interfaces/IAuth.service";
import { IAuthPublisherService, IAuthPublisherServiceToken } from "@/auth/services/interfaces/IAuthPublisher.service";
import { IRefreshTokenService, IRefreshTokenServiceToken } from "@/auth/services/interfaces/IRefreshToken.service";
import { AuthenticationResult } from "@/auth/types/authenticationResult";
import { User } from "@/user/models/User.model";
import { IUserService, IUserServiceToken } from "@/user/services/interfaces/IUser.service";

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        @Inject(IUserServiceToken)
        private userService: IUserService,
        @Inject(IRefreshTokenServiceToken)
        private refreshTokenService: IRefreshTokenService,
        @Inject(IAuthPublisherServiceToken)
        private publisher: IAuthPublisherService
    ) {}

    public async login(email: string, password: string): Promise<AuthenticationResult> {
        const user = await this.userService.findByCredentials(email, password);
        return await this.generateTokens(user);
    }

    public async redeemRefreshToken(refreshToken: string): Promise<AuthenticationResult> {
        const { id, email } = await this.refreshTokenService.redeem(refreshToken);
        return await this.generateTokens({ id, email });
    }

    public async register(email: string, password: string): Promise<void> {
        const user = await this.userService.save(email, password);
        this.publisher.onUserRegistered(user);
        await this.userService.requestActivation(email);
    }

    public async logout(refreshToken: string): Promise<void> {
        return this.refreshTokenService.invalidate(refreshToken);
    }

    private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = { ...user, ver: CURRENT_JWT_VERSION };
        const secret = this.configService.getOrThrow<string>("jwt.signingSecret");
        const expiresIn = this.configService.getOrThrow<number>("jwt.expirationTimeInSeconds");

        const accessToken = await this.jwtService.signAsync(payload, {
            secret,
            expiresIn,
        });
        const refreshToken = await this.refreshTokenService.sign(payload);

        return { accessToken, refreshToken };
    }
}
