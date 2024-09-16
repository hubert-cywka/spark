import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { CURRENT_JWT_VERSION } from "@/auth/constants";
import { IRefreshTokenService, IRefreshTokenServiceToken } from "@/auth/services/IRefreshToken.service";
import { AuthenticationResult } from "@/auth/types/authenticationResult";
import { User } from "@/user/models/User.model";
import { IUserService, IUserServiceToken } from "@/user/services/IUser.service";

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        @Inject(IUserServiceToken)
        private userService: IUserService,
        @Inject(IRefreshTokenServiceToken)
        private refreshTokenService: IRefreshTokenService
    ) {}

    public async loginWithCredentials(email: string, password: string): Promise<AuthenticationResult> {
        const user = await this.userService.findByCredentials(email, password);
        return await this.generateTokens(user);
    }

    public async loginWithRefreshToken(refreshToken: string): Promise<AuthenticationResult> {
        const { id, email } = await this.refreshTokenService.use(refreshToken);
        return await this.generateTokens({ id, email });
    }

    public async register(email: string, password: string): Promise<AuthenticationResult> {
        const user = await this.userService.save(email, password);
        return await this.generateTokens(user);
    }

    public async logout(refreshToken: string): Promise<void> {
        return this.refreshTokenService.invalidate(refreshToken);
    }

    private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = { ...user, ver: CURRENT_JWT_VERSION };
        const secret = this.configService.get("jwt.signingSecret");
        const expiresIn = this.configService.get("jwt.expirationTimeInSeconds");

        const accessToken = await this.jwtService.signAsync(payload, {
            secret,
            expiresIn,
        });
        const refreshToken = await this.refreshTokenService.sign(payload);

        return { accessToken, refreshToken };
    }
}
