import { LoggerModule, loggerOptions } from "@hcywka/common";
import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";

import { AuthModule } from "@/auth/Auth.module";
import { ThrottlerWithProxySupportGuard } from "@/common/guards/ThrottlerWithProxySupport.guard";
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
                    ttl: configService.get("throttle.ttl") as number,
                    limit: configService.get("throttle.limit") as number,
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
            useClass: ThrottlerWithProxySupportGuard,
        },
    ],
    exports: [ConfigModule],
})
export class AppModule {}
