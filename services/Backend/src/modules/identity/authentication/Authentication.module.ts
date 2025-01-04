import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AccountModule } from "@/modules/identity/account/Account.module";
import { AuthenticationController } from "@/modules/identity/authentication/controllers/Authentication.controller";
import { OpenIDConnectController } from "@/modules/identity/authentication/controllers/OpenIDConnect.controller";
import { AccountPasswordUpdatedEventHandler } from "@/modules/identity/authentication/events/AccountPasswordUpdatedEvent.handler";
import { AuthenticationService } from "@/modules/identity/authentication/services/implementations/Authentication.service";
import { AuthPublisherService } from "@/modules/identity/authentication/services/implementations/AuthPublisher.service";
import { OIDCProviderFactory } from "@/modules/identity/authentication/services/implementations/OIDCProvider.factory";
import { RefreshTokenService } from "@/modules/identity/authentication/services/implementations/RefreshToken.service";
import { IAuthenticationServiceToken } from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import { IAuthPublisherServiceToken } from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";
import { IOIDCProviderFactoryToken } from "@/modules/identity/authentication/services/interfaces/IOIDCProvider.factory";
import { IRefreshTokenServiceToken } from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";
import { AccessTokenStrategy } from "@/modules/identity/authentication/strategies/passport/AccessToken.strategy";
import { IRefreshTokenCookieStrategyToken } from "@/modules/identity/authentication/strategies/refreshToken/IRefreshTokenCookie.strategy";
import { SecureRefreshTokenCookieStrategy } from "@/modules/identity/authentication/strategies/refreshToken/SecureRefreshTokenCookie.strategy";

@Module({
    imports: [PassportModule, JwtModule, AccountModule],
    providers: [
        {
            provide: IAuthenticationServiceToken,
            useClass: AuthenticationService,
        },
        {
            provide: IOIDCProviderFactoryToken,
            useClass: OIDCProviderFactory,
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
            provide: IRefreshTokenCookieStrategyToken,
            useClass: SecureRefreshTokenCookieStrategy,
        },
        AccessTokenStrategy,
        AccountPasswordUpdatedEventHandler,
    ],
    controllers: [AuthenticationController, OpenIDConnectController],
    exports: [AccessTokenStrategy, AccountPasswordUpdatedEventHandler],
})
export class AuthenticationModule {}
