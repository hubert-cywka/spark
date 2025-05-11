import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { LoggerModule } from "nestjs-pino";

import { IntegrationEventsModule, IntegrationEventStreams, IntegrationEventTopics } from "@/common/events";
import { AccessTokenStrategy } from "@/common/guards/AccessToken.strategy";
import { ThrottlingGuard } from "@/common/guards/Throttling.guard";
import { AppConfig } from "@/config/configuration";
import { loggerOptions } from "@/lib/logger";
import { AlertsModule } from "@/modules/alerts/Alerts.module";
import { GdprModule } from "@/modules/gdpr/Gdpr.module";
import { GlobalModule } from "@/modules/global/Global.module";
import { HealthCheckModule } from "@/modules/healthcheck/HealthCheck.module";
import { IdentityModule } from "@/modules/identity/Identity.module";
import { JournalModule } from "@/modules/journal/Journal.module";
import { MailModule } from "@/modules/mail/Mail.module";
import { UsersModule } from "@/modules/users/Users.module";
import { ModuleImport } from "@/types/Module";

const getAppBaseImports = (): ModuleImport[] => {
    return [
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
        HealthCheckModule,
    ];
};

const getAppImports = (): ModuleImport[] => {
    const imports = getAppBaseImports();

    if (process.env.IDENTITY_MODULE_ENABLED === "true") {
        imports.push(IdentityModule);
    }

    if (process.env.JOURNAL_MODULE_ENABLED === "true") {
        imports.push(JournalModule);
    }

    if (process.env.ALERTS_MODULE_ENABLED === "true") {
        imports.push(AlertsModule);
    }

    if (process.env.USERS_MODULE_ENABLED === "true") {
        imports.push(UsersModule);
    }

    if (process.env.GDPR_MODULE_ENABLED === "true") {
        imports.push(GdprModule);
    }

    if (process.env.MAIL_MODULE_ENABLED === "true") {
        imports.push(MailModule);
    }

    return imports;
};

@Module({
    imports: getAppImports(),
    providers: [{ provide: APP_GUARD, useClass: ThrottlingGuard }, AccessTokenStrategy],
    exports: [],
})
export class AppModule {}
