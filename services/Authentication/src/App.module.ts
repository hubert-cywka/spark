import { LoggerModule, loggerOptions, ThrottlingGuard } from "@hcywka/common";
import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";

import { AuthModule } from "@/auth/Auth.module";
import configuration from "@/config/configuration";
import { DatabaseModule } from "@/database/Database.module";
import { UserModule } from "@/user/User.module";

@Module({
    imports: [
        LoggerModule.forRoot({ pinoHttp: loggerOptions }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        ThrottlerModule.forRootAsync({
            useFactory: (configService: ConfigService) => [
                {
                    ttl: configService.getOrThrow<number>("throttle.ttl"),
                    limit: configService.getOrThrow<number>("throttle.limit"),
                },
            ],
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        DatabaseModule,
        UserModule,
        AuthModule,
    ],
    providers: [
        {
            provide: APP_PIPE,
            useFactory: () => new ValidationPipe({ whitelist: true, transform: true }),
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlingGuard,
        },
    ],
    exports: [],
})
export class AppModule {}
