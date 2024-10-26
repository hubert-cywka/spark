import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthenticationController } from "./authentication/controllers/Authentication.controller";

import { ThrottlingGuard } from "@/common/guards/Throttling.guard";
import { AccountController } from "@/modules/identity/account/controllers/Account.controller";
import { AccountEntity } from "@/modules/identity/account/entities/AccountEntity";
import { AccountService } from "@/modules/identity/account/services/implementations/Account.service";
import { AccountPublisherService } from "@/modules/identity/account/services/implementations/AccountPublisher.service";
import { IAccountPublisherServiceToken } from "@/modules/identity/account/services/interfaces/IAccountPublisherService";
import { IAccountServiceToken } from "@/modules/identity/account/services/interfaces/IAccountService";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";
import { AuthenticationService } from "@/modules/identity/authentication/services/implementations/Authentication.service";
import { AuthPublisherService } from "@/modules/identity/authentication/services/implementations/AuthPublisher.service";
import { RefreshTokenService } from "@/modules/identity/authentication/services/implementations/RefreshToken.service";
import { IAuthServiceToken } from "@/modules/identity/authentication/services/interfaces/IAuthenticationService";
import { IAuthPublisherServiceToken } from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";
import { IRefreshTokenServiceToken } from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";
import { AccessTokenStrategy } from "@/modules/identity/authentication/strategies/AccessToken.strategy";

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
        TypeOrmModule.forFeature([RefreshTokenEntity, AccountEntity]),
    ],
    controllers: [AuthenticationController, AccountController],
    providers: [
        { provide: APP_GUARD, useClass: ThrottlingGuard },
        { provide: IAuthServiceToken, useClass: AuthenticationService },
        { provide: IAuthPublisherServiceToken, useClass: AuthPublisherService },
        { provide: IRefreshTokenServiceToken, useClass: RefreshTokenService },
        { provide: IAccountServiceToken, useClass: AccountService },
        {
            provide: IAccountPublisherServiceToken,
            useClass: AccountPublisherService,
        },
        AccessTokenStrategy,
    ],
})
export class IdentityModule {}
