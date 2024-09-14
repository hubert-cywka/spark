import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import configuration from "./config/configuration";

import { GraphQLGatewayModule } from "@/graphql/graphql-gateway.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        GraphQLGatewayModule,
    ],
})
export class AppModule {}
