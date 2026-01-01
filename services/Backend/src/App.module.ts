import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { LoggerModule } from "nestjs-pino";

import { CacheModule } from "@/common/cache/Cache.module";
import { IntegrationEventsModule } from "@/common/events";
import { AccessTokenStrategy } from "@/common/guards/AccessToken.strategy";
import { ObjectStorageModule } from "@/common/objectStorage/ObjectStorage.module";
import { ServiceToServiceModule } from "@/common/s2s/ServiceToService.module";
import { AppConfig } from "@/config/configuration";
import { logger, loggerOptions } from "@/lib/logger";
import { AlertsModule } from "@/modules/alerts/Alerts.module";
import { ConfigurationModule } from "@/modules/configuration/Configuration.module";
import { ExportsModule } from "@/modules/exports/Exports.module";
import { GlobalModule } from "@/modules/global/Global.module";
import { HealthCheckModule } from "@/modules/healthcheck/HealthCheck.module";
import { IdentityModule } from "@/modules/identity/Identity.module";
import { JournalModule } from "@/modules/journal/Journal.module";
import { MailModule } from "@/modules/mail/Mail.module";
import { PrivacyModule } from "@/modules/privacy/Privacy.module";
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
    PRIVACY_MODULE_ENABLED: PrivacyModule,
    EXPORTS_MODULE_ENABLED: ExportsModule,
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
        CacheModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                connectionString: configService.getOrThrow<string>("cache.connectionString"),
            }),
            inject: [ConfigService],
            global: true,
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
        ServiceToServiceModule.forRootAsync({
            useFactory: (config: ConfigService) => {
                return {
                    proxy: {
                        url: config.getOrThrow<string>("gateway.internalUrl"),
                    },
                };
            },
            inject: [ConfigService],
            global: true,
        }),
        ObjectStorageModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                credentials: {
                    accessKeyId: configService.getOrThrow<string>("s3.accessKeyId"),
                    secretAccessKey: configService.getOrThrow<string>("s3.secretAccessKey"),
                },
                region: configService.getOrThrow<string>("s3.region"),
                endpoint: configService.getOrThrow<string>("s3.endpoint"),
            }),
            inject: [ConfigService],
            global: true,
        }),
        ConfigurationModule.forRoot({ global: true }),
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
    providers: [AccessTokenStrategy],
    exports: [],
})
export class AppModule {}
