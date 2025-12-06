import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { LoggerModule } from "nestjs-pino";

import { IntegrationEventsModule } from "@/common/events";
import { AccessTokenStrategy } from "@/common/guards/AccessToken.strategy";
import { ThrottlingGuard } from "@/common/guards/Throttling.guard";
import { AppConfig } from "@/config/configuration";
import { logger, loggerOptions } from "@/lib/logger";
import { AlertsModule } from "@/modules/alerts/Alerts.module";
import {ConfigurationModule} from "@/modules/configuration/Configuration.module";
import { GdprModule } from "@/modules/gdpr/Gdpr.module";
import { GlobalModule } from "@/modules/global/Global.module";
import { HealthCheckModule } from "@/modules/healthcheck/HealthCheck.module";
import { IdentityModule } from "@/modules/identity/Identity.module";
import { JournalModule } from "@/modules/journal/Journal.module";
import { MailModule } from "@/modules/mail/Mail.module";
import { SchedulingModule } from "@/modules/scheduling/Scheduling.module";
import { UsersModule } from "@/modules/users/Users.module";
import { ModuleImport } from "@/types/Module";

const PLUGGABLE_MODULES_MAP = {
    CONFIGURATION_MODULE_ENABLED: ConfigurationModule,
    SCHEDULING_MODULE_ENABLED: SchedulingModule,
    IDENTITY_MODULE_ENABLED: IdentityModule,
    JOURNAL_MODULE_ENABLED: JournalModule,
    ALERTS_MODULE_ENABLED: AlertsModule,
    USERS_MODULE_ENABLED: UsersModule,
    GDPR_MODULE_ENABLED: GdprModule,
    MAIL_MODULE_ENABLED: MailModule,
};

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
                    clientId: config.getOrThrow<string>("appName"),
                    brokers: config.getOrThrow<string[]>("pubsub.brokers"),
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

    for (const [flag, module] of Object.entries(PLUGGABLE_MODULES_MAP)) {
        if (process.env[flag] !== "true") {
            continue;
        }

        imports.push(module);
        logger.log(`Module ${module.name} enabled.`);
    }

    return imports;
};

@Module({
    imports: getAppImports(),
    providers: [{ provide: APP_GUARD, useClass: ThrottlingGuard }, AccessTokenStrategy],
    exports: [],
})
export class AppModule {}
