import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { LoggerModule } from "nestjs-pino";

import { IntegrationEventsModule } from "@/common/events";
import { ThrottlingGuard } from "@/common/guards/Throttling.guard";
import { AppConfig } from "@/config/configuration";
import { loggerOptions } from "@/lib/logger";
import { AccessTokenStrategy } from "@/modules/identity/authentication/strategies/passport/AccessToken.strategy";
import { JournalModule } from "@/modules/journal/Journal.module";

// TODO: Do we need additional protection against CSRF? Are SameSite=Strict cookies + in-memory access tokens good enough?
@Module({
    imports: [
        LoggerModule.forRoot({ pinoHttp: loggerOptions }),
        ConfigModule.forRoot({
            load: [AppConfig],
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        ThrottlerModule.forRootAsync({
            useFactory: (configService: ConfigService) => [
                {
                    ttl: configService.getOrThrow<number>("throttle.ttl"),
                    limit: configService.getOrThrow<number>("throttle.limit"),
                    scope: [
                        {
                            endpoint: "identity",
                            ttl: configService.getOrThrow<number>("modules.identity.throttle.ttl"),
                            limit: configService.getOrThrow<number>("modules.identity.throttle.limit"),
                        },
                    ],
                },
            ],
            inject: [ConfigService],
        }),
        IntegrationEventsModule.forRootAsync({
            useFactory: (config: ConfigService) => {
                return {
                    connection: {
                        port: config.getOrThrow<number>("pubsub.port"),
                        host: config.getOrThrow<string>("pubsub.host"),
                    },
                };
            },
            inject: [ConfigService],
            global: true,
        }),
        JournalModule,
    ],
    providers: [{ provide: APP_GUARD, useClass: ThrottlingGuard }, AccessTokenStrategy],
    exports: [AccessTokenStrategy],
})
export class AppModule {}
