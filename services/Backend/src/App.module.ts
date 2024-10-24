import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { LoggerModule } from "nestjs-pino";

import { PubSubModule } from "@/common/pubsub";
import { AppConfig } from "@/config/configuration";
import { AuthModule } from "@/modules/auth/Auth.module";
import { DatabaseModule } from "@/modules/auth/database/Database.module";
import { MailModule } from "@/modules/mail/Mail.module";
import { UsersModule } from "@/modules/users/Users.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [AppConfig],
            isGlobal: true,
        }),
        LoggerModule.forRoot({ pinoHttp: {} }),
        PubSubModule.forRootAsync({
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
        DatabaseModule,
        AuthModule,
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
