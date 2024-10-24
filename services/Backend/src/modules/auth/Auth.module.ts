import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthController } from "./Auth.controller";

import { ThrottlingGuard } from "@/common/guards/Throttling.guard";
import { RefreshTokenEntity } from "@/modules/auth/entities/RefreshToken.entity";
import { UserEntity } from "@/modules/auth/entities/User.entity";
import { AuthService } from "@/modules/auth/services/implementations/Auth.service";
import { AuthPublisherService } from "@/modules/auth/services/implementations/AuthPublisher.service";
import { RefreshTokenService } from "@/modules/auth/services/implementations/RefreshToken.service";
import { UserService } from "@/modules/auth/services/implementations/User.service";
import { UserPublisherService } from "@/modules/auth/services/implementations/UserPublisher.service";
import { IAuthServiceToken } from "@/modules/auth/services/interfaces/IAuth.service";
import { IAuthPublisherServiceToken } from "@/modules/auth/services/interfaces/IAuthPublisher.service";
import { IRefreshTokenServiceToken } from "@/modules/auth/services/interfaces/IRefreshToken.service";
import { IUserServiceToken } from "@/modules/auth/services/interfaces/IUser.service";
import { IUserPublisherServiceToken } from "@/modules/auth/services/interfaces/IUserPublisher.service";
import { AccessTokenStrategy } from "@/modules/auth/strategies/AccessToken.strategy";

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            useFactory: (configService: ConfigService) => [
                {
                    ttl: configService.getOrThrow<number>("modules.auth.throttle.ttl"),
                    limit: configService.getOrThrow<number>("modules.auth.throttle.limit"),
                },
            ],
            inject: [ConfigService],
        }),
        PassportModule,
        JwtModule,
        TypeOrmModule.forFeature([RefreshTokenEntity, UserEntity]),
    ],
    controllers: [AuthController],
    providers: [
        { provide: APP_GUARD, useClass: ThrottlingGuard },
        { provide: IAuthServiceToken, useClass: AuthService },
        { provide: IAuthPublisherServiceToken, useClass: AuthPublisherService },
        { provide: IRefreshTokenServiceToken, useClass: RefreshTokenService },
        { provide: IUserServiceToken, useClass: UserService },
        { provide: IUserPublisherServiceToken, useClass: UserPublisherService },
        AccessTokenStrategy,
    ],
})
export class AuthModule {}
