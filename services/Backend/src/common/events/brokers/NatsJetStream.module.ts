import { type JetStreamClient, jetstream, jetstreamManager } from "@nats-io/jetstream";
import { DynamicModule, Logger, Module } from "@nestjs/common";
import { connect, DiscardPolicy, NatsConnection, RetentionPolicy } from "nats";

import { NatsJetStreamPubSubClient } from "@/common/events/brokers/services/NatsJetStreamPubSubClient";
import { PubSubClientToken } from "@/common/events/services/interfaces/IPubSubClient";
import { EventStream } from "@/common/events/types";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

const NatsConnectionToken = Symbol("NatsConnection");
const NatsJetStreamOptionsToken = Symbol("NatsJetStreamOptions");
const NatsJetStreamClientToken = Symbol("NatsJetStreamClient");
const NatsJetStreamManagerToken = Symbol("NatsJetStreamManager");

export type NatsJetStreamModuleOptions = {
    connection: NatsJetStreamConnectionOptions;
    streams: EventStream[];
};

type NatsJetStreamConnectionOptions = {
    host: string;
    port: number;
};

@Module({})
export class NatsJetStreamModule {
    private static readonly logger = new Logger(NatsJetStreamModule.name);

    static forRootAsync(options: {
        useFactory: UseFactory<NatsJetStreamModuleOptions>;
        inject?: UseFactoryArgs;
        global?: boolean;
    }): DynamicModule {
        return {
            module: NatsJetStreamModule,
            providers: [
                {
                    provide: NatsJetStreamOptionsToken,
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },

                {
                    provide: NatsConnectionToken,
                    useFactory: async (options: NatsJetStreamModuleOptions) => {
                        const connection = await connect({
                            servers: `${options.connection.host}:${options.connection.port}`,
                        });

                        NatsJetStreamModule.logger.log({ connection }, "Connected to Nats JetStream.");
                        return connection;
                    },
                    inject: [NatsJetStreamOptionsToken],
                },

                {
                    provide: NatsJetStreamClientToken,
                    useFactory: (connection: NatsConnection) => jetstream(connection),
                    inject: [NatsConnectionToken],
                },

                {
                    provide: PubSubClientToken,
                    useFactory: async (client: JetStreamClient) => new NatsJetStreamPubSubClient(client),
                    inject: [NatsJetStreamClientToken],
                },

                {
                    provide: NatsJetStreamManagerToken,
                    useFactory: async (connection: NatsConnection, { streams }: NatsJetStreamModuleOptions) => {
                        const manager = await jetstreamManager(connection);

                        for (const stream of streams) {
                            await manager.streams.add({
                                retention: RetentionPolicy.Limits,
                                discard: DiscardPolicy.Old,
                                ...stream,
                            });

                            NatsJetStreamModule.logger.log({ stream }, "Stream configured.");
                        }
                    },
                    inject: [NatsConnectionToken, NatsJetStreamOptionsToken],
                },
            ],
            exports: [PubSubClientToken],
            global: options.global,
        };
    }
}
