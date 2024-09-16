import { LoggerModule, loggerOptions } from "@hcywka/nestjs-logger";
import { ApolloFederationDriver, ApolloFederationDriverConfig } from "@nestjs/apollo";
import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";

import { UsersModule } from "./users/Users.module";

import configuration from "@/config/configuration";
import { DatabaseModule } from "@/database/Database.module";

@Module({
    imports: [
        LoggerModule.forRoot({ pinoHttp: loggerOptions }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        GraphQLModule.forRoot<ApolloFederationDriverConfig>({
            driver: ApolloFederationDriver,
            autoSchemaFile: {
                federation: 2,
            },
        }),
        DatabaseModule,
        UsersModule,
    ],
    providers: [
        {
            provide: APP_PIPE,
            useFactory: () => new ValidationPipe({ whitelist: true, transform: true }),
        },
    ],
    exports: [ConfigModule],
})
export class AppModule {}
