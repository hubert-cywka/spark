import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AccountModule } from "@/modules/identity/account/Account.module";
import { AccessScopesController } from "@/modules/identity/authentication/controllers/AccessScopes.controller";
import { AuthenticationController } from "@/modules/identity/authentication/controllers/Authentication.controller";
import { OpenIDConnectController } from "@/modules/identity/authentication/controllers/OpenIDConnect.controller";
import { TwoFactorAuthenticationController } from "@/modules/identity/authentication/controllers/TwoFactorAuthentication.controller";
import { AccountPasswordUpdatedEventHandler } from "@/modules/identity/authentication/events/AccountPasswordUpdatedEvent.handler";
import { AccountSuspendedEventHandler } from "@/modules/identity/authentication/events/AccountSuspendedEvent.handler";
import { AuthenticationMapper } from "@/modules/identity/authentication/mappers/Authentication.mapper";
import { AuthenticationMapperToken } from "@/modules/identity/authentication/mappers/IAuthentication.mapper";
import { TwoFactorAuthenticationOptionMapperToken } from "@/modules/identity/authentication/mappers/ITwoFactorAuthenticationOption.mapper";
import { TwoFactorAuthenticationOptionMapper } from "@/modules/identity/authentication/mappers/TwoFactorAuthenticationOption.mapper";
import { AuthenticationService } from "@/modules/identity/authentication/services/implementations/Authentication.service";
import { AuthPublisherService } from "@/modules/identity/authentication/services/implementations/AuthPublisher.service";
import { OIDCProviderFactory } from "@/modules/identity/authentication/services/implementations/OIDCProvider.factory";
import { RefreshTokenService } from "@/modules/identity/authentication/services/implementations/RefreshToken.service";
import { TwoFactorAuthenticationFactory } from "@/modules/identity/authentication/services/implementations/TwoFactorAuthentication.factory";
import { TwoFactorAuthenticationPublisherService } from "@/modules/identity/authentication/services/implementations/TwoFactorAuthenticationPublisher.service";
import { AuthenticationServiceToken } from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import { AuthPublisherServiceToken } from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";
import { OIDCProviderFactoryToken } from "@/modules/identity/authentication/services/interfaces/IOIDCProvider.factory";
import { RefreshTokenServiceToken } from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";
import { TwoFactorAuthenticationFactoryToken } from "@/modules/identity/authentication/services/interfaces/ITwoFactorAuthentication.factory";
import { TwoFactorAuthenticationPublisherServiceToken } from "@/modules/identity/authentication/services/interfaces/ITwoFactorAuthenticationPublisher.service";
import { RefreshTokenCookieStrategyToken } from "@/modules/identity/authentication/strategies/refreshToken/IRefreshTokenCookie.strategy";
import { SecureRefreshTokenCookieStrategy } from "@/modules/identity/authentication/strategies/refreshToken/SecureRefreshTokenCookie.strategy";
import { AuthorizationModule } from "@/modules/identity/authorization/Authorization.module";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    imports: [IdentitySharedModule, PassportModule, JwtModule, AccountModule, AuthorizationModule],
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
            provide: TwoFactorAuthenticationOptionMapperToken,
            useClass: TwoFactorAuthenticationOptionMapper,
        },
        {
            provide: TwoFactorAuthenticationFactoryToken,
            useClass: TwoFactorAuthenticationFactory,
        },
        {
            provide: TwoFactorAuthenticationPublisherServiceToken,
            useClass: TwoFactorAuthenticationPublisherService,
        },
        {
            provide: RefreshTokenCookieStrategyToken,
            useClass: SecureRefreshTokenCookieStrategy,
        },
        AccountPasswordUpdatedEventHandler,
        AccountSuspendedEventHandler,
    ],
    controllers: [AuthenticationController, OpenIDConnectController, TwoFactorAuthenticationController, AccessScopesController],
    exports: [AccountPasswordUpdatedEventHandler, AccountSuspendedEventHandler],
})
export class AuthenticationModule {}
