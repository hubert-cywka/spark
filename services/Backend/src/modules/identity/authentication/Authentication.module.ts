import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AccountModule } from "@/modules/identity/account/Account.module";
import { AuthenticationController } from "@/modules/identity/authentication/controllers/Authentication.controller";
import { OpenIDConnectController } from "@/modules/identity/authentication/controllers/OpenIDConnect.controller";
import { AccountPasswordUpdatedEventHandler } from "@/modules/identity/authentication/events/AccountPasswordUpdatedEvent.handler";
import { AccountSuspendedEventHandler } from "@/modules/identity/authentication/events/AccountSuspendedEvent.handler";
import { AuthenticationMapper } from "@/modules/identity/authentication/mappers/Authentication.mapper";
import { AuthenticationMapperToken } from "@/modules/identity/authentication/mappers/IAuthentication.mapper";
import { AuthenticationService } from "@/modules/identity/authentication/services/implementations/Authentication.service";
import { AuthPublisherService } from "@/modules/identity/authentication/services/implementations/AuthPublisher.service";
import { OIDCProviderFactory } from "@/modules/identity/authentication/services/implementations/OIDCProvider.factory";
import { RefreshTokenService } from "@/modules/identity/authentication/services/implementations/RefreshToken.service";
import { SudoModeService } from "@/modules/identity/authentication/services/implementations/SudoMode.service";
import { AuthenticationServiceToken } from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import { AuthPublisherServiceToken } from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";
import { OIDCProviderFactoryToken } from "@/modules/identity/authentication/services/interfaces/IOIDCProvider.factory";
import { RefreshTokenServiceToken } from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";
import { SudoModeServiceToken } from "@/modules/identity/authentication/services/interfaces/ISudoMode.service";
import { AccessTokenStrategy } from "@/modules/identity/authentication/strategies/passport/AccessToken.strategy";
import { SudoModeStrategy } from "@/modules/identity/authentication/strategies/passport/SudoMode.strategy";
import { RefreshTokenCookieStrategyToken } from "@/modules/identity/authentication/strategies/refreshToken/IRefreshTokenCookie.strategy";
import { SecureRefreshTokenCookieStrategy } from "@/modules/identity/authentication/strategies/refreshToken/SecureRefreshTokenCookie.strategy";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    imports: [IdentitySharedModule, PassportModule, JwtModule, AccountModule],
    providers: [
        {
            provide: SudoModeServiceToken,
            useClass: SudoModeService,
        },
        {
            provide: AuthenticationMapperToken,
            useClass: AuthenticationMapper,
        },
        {
            provide: AuthenticationServiceToken,
            useClass: AuthenticationService,
        },
        {
            provide: OIDCProviderFactoryToken,
            useClass: OIDCProviderFactory,
        },
        {
            provide: AuthPublisherServiceToken,
            useClass: AuthPublisherService,
        },
        {
            provide: RefreshTokenServiceToken,
            useClass: RefreshTokenService,
        },
        {
            provide: RefreshTokenCookieStrategyToken,
            useClass: SecureRefreshTokenCookieStrategy,
        },
        AccessTokenStrategy,
        SudoModeStrategy,
        AccountPasswordUpdatedEventHandler,
        AccountSuspendedEventHandler,
    ],
    controllers: [AuthenticationController, OpenIDConnectController],
    exports: [AccessTokenStrategy, SudoModeStrategy, AccountPasswordUpdatedEventHandler, AccountSuspendedEventHandler],
})
export class AuthenticationModule {}
