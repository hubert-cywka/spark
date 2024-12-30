import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ThrottlerModule } from "@nestjs/throttler";
import { getDataSourceToken } from "@nestjs/typeorm";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { ClsModule } from "nestjs-cls";

import { AuthenticationController } from "./authentication/controllers/Authentication.controller";

import { DatabaseModule } from "@/common/database/Database.module";
import { IInboxEventHandler, InboxEventHandlersToken, IntegrationEventsModule } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
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
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { InitializeIdentityModule1735496597920 } from "@/modules/identity/infrastructure/database/migrations/1735496597920-InitializeIdentityModule";
import { IdentityEventBoxFactory } from "@/modules/identity/shared/services/IdentityEventBox.factory";

@Module({
    providers: [
        { provide: APP_GUARD, useClass: ThrottlingGuard },
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
        AccountPasswordUpdatedEventHandler,
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [AccessTokenStrategy, AccountPasswordUpdatedEventHandler],
        },
    ],
    imports: [
        DatabaseModule.forRootAsync(
            IDENTITY_MODULE_DATA_SOURCE,
            [
                RefreshTokenEntity,
                SingleUseTokenEntity,
                BaseAccountEntity,
                ManagedAccountEntity,
                FederatedAccountEntity,
                OutboxEventEntity,
                InboxEventEntity,
            ],
            {
                useFactory: (configService: ConfigService) => ({
                    port: configService.getOrThrow<number>("modules.auth.database.port"),
                    username: configService.getOrThrow<string>("modules.auth.database.username"),
                    password: configService.getOrThrow<string>("modules.auth.database.password"),
                    host: configService.getOrThrow<string>("modules.auth.database.host"),
                    database: configService.getOrThrow<string>("modules.auth.database.name"),
                    migrations: [InitializeIdentityModule1735496597920],
                }),
                inject: [ConfigService],
            }
        ),
        IntegrationEventsModule.forFeature({
            eventBoxFactoryClass: IdentityEventBoxFactory,
            context: IdentityModule.name,
        }),
        ClsModule.forRoot({
            middleware: {
                mount: true,
            },
            plugins: [
                new ClsPluginTransactional({
                    connectionName: IDENTITY_MODULE_DATA_SOURCE,
                    adapter: new TransactionalAdapterTypeOrm({
                        dataSourceToken: getDataSourceToken(IDENTITY_MODULE_DATA_SOURCE),
                    }),
                }),
            ],
        }),
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
    ],
    controllers: [AuthenticationController, OpenIDConnectController, AccountController],
})
export class IdentityModule {}
