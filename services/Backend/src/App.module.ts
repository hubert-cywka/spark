import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { LoggerModule } from "nestjs-pino";

import { IntegrationEventsModule, IntegrationEventStreams, IntegrationEventTopics } from "@/common/events";
import { ThrottlingGuard } from "@/common/guards/Throttling.guard";
import { AppConfig } from "@/config/configuration";
import { GlobalModule } from "@/Global.module";
import { loggerOptions } from "@/lib/logger";
import { AlertsModule } from "@/modules/alerts/Alerts.module";
import { GdprModule } from "@/modules/gdpr/Gdpr.module";
import { IdentityModule } from "@/modules/identity/Identity.module";
import { JournalModule } from "@/modules/journal/Journal.module";
import { MailModule } from "@/modules/mail/Mail.module";
import { UsersModule } from "@/modules/users/Users.module";

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
                    streams: [
                        {
                            name: IntegrationEventStreams.account,
                            subjects: [IntegrationEventTopics.account.all],
                        },
                        {
                            name: IntegrationEventStreams.alert,
                            subjects: [IntegrationEventTopics.alert.all],
                        },
                        {
                            name: IntegrationEventStreams.twoFactorAuth,
                            subjects: [IntegrationEventTopics.twoFactorAuth.all],
                        },
                    ],
                };
            },
            inject: [ConfigService],
            global: true,
        }),
        GlobalModule,
        IdentityModule,
        MailModule,
        UsersModule,
        JournalModule,
        AlertsModule,
        GdprModule,
    ],
    providers: [{ provide: APP_GUARD, useClass: ThrottlingGuard }],
    exports: [],
})
export class AppModule {}
