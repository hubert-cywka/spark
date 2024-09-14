import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { LoggerModule } from "nestjs-pino";

import { AuthModule } from "@/auth/auth.module";
import { AuthGuard } from "@/auth/guards/auth.guard";
import configuration from "@/config/configuration";

@Module({
    imports: [
        LoggerModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        AuthModule,
    ],
    providers: [
        { provide: APP_GUARD, useClass: AuthGuard },
        {
            provide: APP_PIPE,
            useFactory: () => new ValidationPipe({ whitelist: true, transform: true }),
        },
    ],
    exports: [ConfigModule],
})
export class AppModule {}
