import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { TwoFactorAuthModule } from "@/modules/identity/2fa/TwoFactorAuth.module";
import { AccountModule } from "@/modules/identity/account/Account.module";
import { AccessScopesController } from "@/modules/identity/authentication/controllers/AccessScopes.controller";
import { AuthenticationController } from "@/modules/identity/authentication/controllers/Authentication.controller";
import { OpenIDConnectController } from "@/modules/identity/authentication/controllers/OpenIDConnect.controller";
import { AccountPasswordUpdatedEventHandler } from "@/modules/identity/authentication/events/AccountPasswordUpdatedEvent.handler";
import { AccountSuspendedEventHandler } from "@/modules/identity/authentication/events/AccountSuspendedEvent.handler";
import { AuthenticationMapper } from "@/modules/identity/authentication/mappers/Authentication.mapper";
import { AuthenticationMapperToken } from "@/modules/identity/authentication/mappers/IAuthentication.mapper";
import { AccessScopesService } from "@/modules/identity/authentication/services/implementations/AccessScopes.service";
import { AuthenticationService } from "@/modules/identity/authentication/services/implementations/Authentication.service";
import { AuthPublisherService } from "@/modules/identity/authentication/services/implementations/AuthPublisher.service";
import { OIDCProviderFactory } from "@/modules/identity/authentication/services/implementations/OIDCProvider.factory";
import { RefreshTokenService } from "@/modules/identity/authentication/services/implementations/RefreshToken.service";
import { AccessScopesServiceToken } from "@/modules/identity/authentication/services/interfaces/IAccessScopes.service";
import { AuthenticationServiceToken } from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import { AuthPublisherServiceToken } from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";
import { OIDCProviderFactoryToken } from "@/modules/identity/authentication/services/interfaces/IOIDCProvider.factory";
import { RefreshTokenServiceToken } from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";
import { AccessTokenStrategy } from "@/modules/identity/authentication/strategies/AccessToken.strategy";
import { RefreshTokenCookieStrategyToken } from "@/modules/identity/authentication/strategies/refreshToken/IRefreshTokenCookie.strategy";
import { SecureRefreshTokenCookieStrategy } from "@/modules/identity/authentication/strategies/refreshToken/SecureRefreshTokenCookie.strategy";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    imports: [IdentitySharedModule, PassportModule, JwtModule, AccountModule, TwoFactorAuthModule],
    providers: [
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
        { provide: AccessScopesServiceToken, useClass: AccessScopesService },
        AccessTokenStrategy,
        AccountPasswordUpdatedEventHandler,
        AccountSuspendedEventHandler,
    ],
    controllers: [AuthenticationController, OpenIDConnectController, AccessScopesController],
    exports: [AccountPasswordUpdatedEventHandler, AccountSuspendedEventHandler, AccessTokenStrategy],
})
export class AuthenticationModule {}
