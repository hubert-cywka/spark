import { jetstreamManager } from "@nats-io/jetstream";
import { DynamicModule, Inject, Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { type NatsConnection, connect, DiscardPolicy, RetentionPolicy } from "nats";

import { NatsJetStreamConsumer } from "@/common/events/brokers/services/NatsJetStreamConsumer";
import { NatsJetStreamProducer } from "@/common/events/brokers/services/NatsJetStreamProducer";
import { PubSubConsumerToken } from "@/common/events/services/interfaces/IPubSubConsumer";
import { PubSubProducerToken } from "@/common/events/services/interfaces/IPubSubProducer";
import { EventStream } from "@/common/events/types";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

const NatsConnectionToken = Symbol("NatsConnection");
const NatsJetStreamOptionsToken = Symbol("NatsJetStreamOptions");
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
export class NatsJetStreamModule implements OnApplicationShutdown {
    private static readonly logger = new Logger(NatsJetStreamModule.name);

    constructor(
        @Inject(NatsConnectionToken)
        private readonly connection: NatsConnection
    ) {}

    async onApplicationShutdown() {
        if (!this.connection) {
            NatsJetStreamModule.logger.warn("Nats JetStream connection was not injected or is null. Cannot close.");
            return;
        }

        if (this.connection.isDraining() || this.connection.isClosed()) {
            NatsJetStreamModule.logger.log("Connection is already draining or closed. Skipping close.");
            return;
        }

        NatsJetStreamModule.logger.log("Closing Nats JetStream connection.");

        try {
            await this.connection.drain();
            NatsJetStreamModule.logger.log("Closed JetStream connection.");
        } catch (error) {
            NatsJetStreamModule.logger.error({ error }, "Failed to close JetStream connection.");
        }
    }

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
                    provide: PubSubProducerToken,
                    useFactory: async (connection: NatsConnection) => new NatsJetStreamProducer(connection),
                    inject: [NatsConnectionToken],
                },

                {
                    provide: PubSubConsumerToken,
                    useFactory: async (connection: NatsConnection) => new NatsJetStreamConsumer(connection),
                    inject: [NatsConnectionToken],
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

                        return manager;
                    },
                    inject: [NatsConnectionToken, NatsJetStreamOptionsToken],
                },
            ],
            exports: [PubSubConsumerToken, PubSubProducerToken],
            global: options.global,
        };
    }
}
