import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { LoggerModule } from "nestjs-pino";

import { IntegrationEventsModule } from "@/common/events";
import { AppConfig } from "@/config/configuration";
import { loggerOptions } from "@/lib/logger";
import { IdentityModule } from "@/modules/identity/Identity.module";
import { JournalModule } from "@/modules/journal/Journal.module";
import { MailModule } from "@/modules/mail/Mail.module";
import { UsersModule } from "@/modules/users/Users.module";

// TODO: Do we need additional protection against CSRF? Are SameSite=Strict cookies + in-memory access tokens good enough?
@Module({
    imports: [
        LoggerModule.forRoot({ pinoHttp: loggerOptions }),
        ConfigModule.forRoot({
            load: [AppConfig],
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
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
        IdentityModule,
        MailModule,
        UsersModule,
        JournalModule,
    ],
    providers: [],
    exports: [],
})
export class AppModule {}
