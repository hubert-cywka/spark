import { IntrospectAndCompose } from "@apollo/gateway";
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";

import { healthCheckGraphs } from "@/graphql/utils/health-check-graphs";
import { pollResourceUntilReady } from "@/utils/pollResourceUntilReady";

@Module({
    imports: [
        GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
            driver: ApolloGatewayDriver,
            useFactory: async (configService: ConfigService) => {
                const graphs = [
                    {
                        name: "users",
                        url: configService.get("subgraphs.users"),
                    },
                ];
                const urls = graphs.map((graph) => graph.url);

                await pollResourceUntilReady({
                    resourceName: "SubGraphs",
                    maxAttempts: 100,
                    intervalInMilliseconds: 3000,
                    pollingFn: () => healthCheckGraphs(urls),
                });

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
