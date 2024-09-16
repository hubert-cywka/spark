import { LoggerModule, loggerOptions } from "@hcywka/common";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import configuration from "./config/configuration";

import { GraphQLGatewayModule } from "@/graphql/GraphQLGateway.module";

@Module({
    imports: [
        LoggerModule.forRoot({ pinoHttp: loggerOptions }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        GraphQLGatewayModule,
    ],
})
export class AppModule {}
