import { IntrospectAndCompose } from "@apollo/gateway";
import { Logger, pinoLogger, pollResourceUntilReady } from "@hcywka/common";
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";

import { healthCheckGraphs } from "@/graphql/utils/healthCheckGraphs";

@Module({
    imports: [
        GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
            driver: ApolloGatewayDriver,
            useFactory: async (configService: ConfigService) => {
                const graphs = [
                    {
                        name: "users",
                        url: configService.getOrThrow<string>("subgraphs.users"),
                    },
                ];
                const urls = graphs.map((graph) => graph.url);

                await pollResourceUntilReady(
                    {
                        resourceName: "SubGraphs",
                        maxAttempts: 100,
                        intervalInMilliseconds: 3000,
                        pollingFn: () => healthCheckGraphs(urls),
                    },
                    new Logger(pinoLogger, {})
                );

                return {
                    server: {},
                    gateway: {
                        supergraphSdl: new IntrospectAndCompose({
                            subgraphs: graphs,
                        }),
                    },
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class GraphQLGatewayModule {}
