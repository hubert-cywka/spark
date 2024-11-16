import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { LoggerModule } from "nestjs-pino";

import { EventsModule } from "@/common/events";
import { AppConfig } from "@/config/configuration";
import { loggerOptions } from "@/lib/logger";
import { IdentityModule } from "@/modules/identity/Identity.module";
import { MailModule } from "@/modules/mail/Mail.module";
import { UsersModule } from "@/modules/users/Users.module";

// TODO: Do we need additional protection against CSRF? Are SameSite=Strict cookies + in-memory access tokens good enough?
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [AppConfig],
            isGlobal: true,
        }),
        LoggerModule.forRoot({ pinoHttp: loggerOptions }),
        EventsModule.forRootAsync({
            global: true,
            useFactory: (configService: ConfigService) => ({
                connection: {
                    port: configService.getOrThrow<number>("pubsub.port"),
                    host: configService.getOrThrow<string>("pubsub.host"),
                },
            }),
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        IdentityModule,
        MailModule,
        UsersModule,
    ],
    providers: [
        {
            provide: APP_PIPE,
            useFactory: () => new ValidationPipe({ whitelist: true, transform: true }),
        },
    ],
    exports: [],
})
export class AppModule {}
