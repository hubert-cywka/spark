import { LoggerModule, loggerOptions } from "@hcywka/common";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import configuration from "@/config/configuration";
import { MailModule } from "@/mail/Mail.module";

@Module({
    imports: [
        LoggerModule.forRoot({ pinoHttp: loggerOptions }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        MailModule,
    ],
    providers: [],
    exports: [ConfigModule],
})
export class AppModule {}
