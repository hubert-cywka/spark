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
import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { FederatedAccountEntity } from "@/modules/identity/account/entities/FederatedAccountEntity";
import { ManagedAccountEntity } from "@/modules/identity/account/entities/ManagedAccountEntity";
import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { AccountPublisherService } from "@/modules/identity/account/services/implementations/AccountPublisher.service";
import { FederatedAccountService } from "@/modules/identity/account/services/implementations/FederatedAccount.service";
import { ManagedAccountService } from "@/modules/identity/account/services/implementations/ManagedAccount.service";
import { SingleUseTokenService } from "@/modules/identity/account/services/implementations/SingleUseToken.service";
import { IAccountPublisherServiceToken } from "@/modules/identity/account/services/interfaces/IAccountPublisher.service";
import { IFederatedAccountServiceToken } from "@/modules/identity/account/services/interfaces/IFederatedAccount.service";
import { IManagedAccountServiceToken } from "@/modules/identity/account/services/interfaces/IManagedAccount.service";
import { ISingleUseTokenServiceToken } from "@/modules/identity/account/services/interfaces/ISingleUseToken.service";
import { OpenIDConnectController } from "@/modules/identity/authentication/controllers/OpenIDConnect.controller";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";
import { AuthenticationService } from "@/modules/identity/authentication/services/implementations/Authentication.service";
import { AuthPublisherService } from "@/modules/identity/authentication/services/implementations/AuthPublisher.service";
import { GoogleOIDCProviderService } from "@/modules/identity/authentication/services/implementations/GoogleOIDCProvider.service";
import { RefreshTokenService } from "@/modules/identity/authentication/services/implementations/RefreshToken.service";
import { IAuthenticationServiceToken } from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import { IAuthPublisherServiceToken } from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";
import { IGoogleOIDCProviderServiceToken } from "@/modules/identity/authentication/services/interfaces/IGoogleOIDCProvider.service";
import { IRefreshTokenServiceToken } from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";
import { AccessTokenStrategy } from "@/modules/identity/authentication/strategies/passport/AccessToken.strategy";
import { IRefreshTokenCookieStrategyToken } from "@/modules/identity/authentication/strategies/refreshToken/IRefreshTokenCookie.strategy";
import { SecureRefreshTokenCookieStrategy } from "@/modules/identity/authentication/strategies/refreshToken/SecureRefreshTokenCookie.strategy";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { DatabaseModule } from "@/modules/identity/infrastructure/database/Database.module";

@Module({
    imports: [
        DatabaseModule,
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
        TypeOrmModule.forFeature(
            [RefreshTokenEntity, SingleUseTokenEntity, BaseAccountEntity, ManagedAccountEntity, FederatedAccountEntity],
            IDENTITY_MODULE_DATA_SOURCE
        ),
    ],
    controllers: [AuthenticationController, OpenIDConnectController, AccountController],
    providers: [
        { provide: APP_GUARD, useClass: ThrottlingGuard },
        {
            provide: IAuthenticationServiceToken,
            useClass: AuthenticationService,
        },
        {
            provide: IGoogleOIDCProviderServiceToken,
            useClass: GoogleOIDCProviderService,
        },
        {
            provide: IAuthPublisherServiceToken,
            useClass: AuthPublisherService,
        },
        {
            provide: IRefreshTokenServiceToken,
            useClass: RefreshTokenService,
        },
        {
            provide: ISingleUseTokenServiceToken,
            useClass: SingleUseTokenService,
        },
        {
            provide: IManagedAccountServiceToken,
            useClass: ManagedAccountService,
        },
        {
            provide: IFederatedAccountServiceToken,
            useClass: FederatedAccountService,
        },
        {
            provide: IAccountPublisherServiceToken,
            useClass: AccountPublisherService,
        },
        {
            provide: IRefreshTokenCookieStrategyToken,
            useClass: SecureRefreshTokenCookieStrategy,
        },
        AccessTokenStrategy,
    ],
})
export class IdentityModule {}
