import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthController } from "./Auth.controller";

import { RefreshTokenEntity } from "@/auth/entities/RefreshToken.entity";
import { AuthService } from "@/auth/services/implementations/Auth.service";
import { AuthMessagePublisherService } from "@/auth/services/implementations/AuthMessagePublisher.service";
import { RefreshTokenService } from "@/auth/services/implementations/RefreshToken.service";
import { IAuthServiceToken } from "@/auth/services/interfaces/IAuth.service";
import { IAuthMessagePublisherServiceToken } from "@/auth/services/interfaces/IAuthMessagePublisher.service";
import { IRefreshTokenServiceToken } from "@/auth/services/interfaces/IRefreshToken.service";
import { AccessTokenStrategy } from "@/auth/strategies/AccessToken.strategy";
import { UserModule } from "@/user/User.module";

@Module({
    imports: [PassportModule, UserModule, JwtModule, TypeOrmModule.forFeature([RefreshTokenEntity])],
    controllers: [AuthController],
    providers: [
        {
            provide: IAuthMessagePublisherServiceToken,
            useClass: AuthMessagePublisherService,
        },
        { provide: IAuthServiceToken, useClass: AuthService },
        { provide: IRefreshTokenServiceToken, useClass: RefreshTokenService },
        AccessTokenStrategy,
    ],
})
export class AuthModule {}
