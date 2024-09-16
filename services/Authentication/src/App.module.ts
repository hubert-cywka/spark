import { LoggerModule, loggerOptions } from "@hcywka/nestjs-logger";
import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";

import { AuthModule } from "@/auth/Auth.module";
import { AuthenticationGuard } from "@/auth/guards/Authentication.guard";
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
        DatabaseModule,
        UserModule,
        AuthModule,
    ],
    providers: [
        { provide: APP_GUARD, useClass: AuthenticationGuard },
        {
            provide: APP_PIPE,
            useFactory: () => new ValidationPipe({ whitelist: true, transform: true }),
        },
    ],
    exports: [ConfigModule],
})
export class AppModule {}
