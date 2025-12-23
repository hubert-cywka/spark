import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { TwoFactorAuthenticationModule } from "@/modules/identity/2fa/TwoFactorAuthentication.module";
import { AccountModule } from "@/modules/identity/account/Account.module";
import { AccessScopesController } from "@/modules/identity/authentication/controllers/AccessScopes.controller";
import { AuthenticationController } from "@/modules/identity/authentication/controllers/Authentication.controller";
import { OpenIDConnectController } from "@/modules/identity/authentication/controllers/OpenIDConnect.controller";
import { AccountPasswordUpdatedEventHandler } from "@/modules/identity/authentication/events/AccountPasswordUpdatedEvent.handler";
import { AccountSuspendedEventHandler } from "@/modules/identity/authentication/events/AccountSuspendedEvent.handler";
import { RefreshTokenInvalidationJobTriggeredEventHandler } from "@/modules/identity/authentication/events/RefreshTokenInvalidationJobTriggeredEvent.handler";
import { AuthenticationMapper } from "@/modules/identity/authentication/mappers/Authentication.mapper";
import { AuthenticationMapperToken } from "@/modules/identity/authentication/mappers/IAuthentication.mapper";
import { AccessScopesService } from "@/modules/identity/authentication/services/implementations/AccessScopesService";
import { AuthenticationService } from "@/modules/identity/authentication/services/implementations/AuthenticationService";
import { OIDCProviderFactory } from "@/modules/identity/authentication/services/implementations/OIDCProvider.factory";
import { RefreshTokenService } from "@/modules/identity/authentication/services/implementations/RefreshTokenService";
import { AccessScopesServiceToken } from "@/modules/identity/authentication/services/interfaces/IAccessScopesService";
import { AuthenticationServiceToken } from "@/modules/identity/authentication/services/interfaces/IAuthenticationService";
import { OIDCProviderFactoryToken } from "@/modules/identity/authentication/services/interfaces/IOIDCProvider.factory";
import { RefreshTokenServiceToken } from "@/modules/identity/authentication/services/interfaces/IRefreshTokenService";
import { RefreshTokenCookieStrategyToken } from "@/modules/identity/authentication/strategies/refreshToken/IRefreshTokenCookie.strategy";
import { SecureRefreshTokenCookieStrategy } from "@/modules/identity/authentication/strategies/refreshToken/SecureRefreshTokenCookie.strategy";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    imports: [IdentitySharedModule, PassportModule, JwtModule, AccountModule, TwoFactorAuthenticationModule],
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
            provide: RefreshTokenServiceToken,
            useClass: RefreshTokenService,
        },
        {
            provide: RefreshTokenCookieStrategyToken,
            useClass: SecureRefreshTokenCookieStrategy,
        },
        { provide: AccessScopesServiceToken, useClass: AccessScopesService },
        AccountPasswordUpdatedEventHandler,
        AccountSuspendedEventHandler,
        RefreshTokenInvalidationJobTriggeredEventHandler,
    ],
    controllers: [AuthenticationController, OpenIDConnectController, AccessScopesController],
    exports: [AccountPasswordUpdatedEventHandler, AccountSuspendedEventHandler, RefreshTokenInvalidationJobTriggeredEventHandler],
})
export class AuthenticationModule {}
