import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { CURRENT_JWT_VERSION } from "@/modules/auth/constants/tokens";
import { LoginDto } from "@/modules/auth/dto/Login.dto";
import { RegisterDto } from "@/modules/auth/dto/Register.dto";
import { IAuthService } from "@/modules/auth/services/interfaces/IAuth.service";
import { IAuthPublisherService, IAuthPublisherServiceToken } from "@/modules/auth/services/interfaces/IAuthPublisher.service";
import { IRefreshTokenService, IRefreshTokenServiceToken } from "@/modules/auth/services/interfaces/IRefreshToken.service";
import { IUserService, IUserServiceToken } from "@/modules/auth/services/interfaces/IUser.service";
import { AuthenticationResult } from "@/modules/auth/types/authenticationResult";

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

    public async login({ email, password }: LoginDto): Promise<AuthenticationResult> {
        const { id } = await this.userService.findByCredentials(email, password);
        return await this.generateTokens(id);
    }

    public async redeemRefreshToken(refreshToken: string): Promise<AuthenticationResult> {
        const { id } = await this.refreshTokenService.redeem(refreshToken);
        return await this.generateTokens(id);
    }

    public async register({ email, password, lastName, firstName }: RegisterDto): Promise<void> {
        const user = await this.userService.save(email, password);
        this.publisher.onUserRegistered({ ...user, firstName, lastName });
        await this.userService.requestActivation(email);
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
