import { type JetStreamClient, jetstream, jetstreamManager } from "@nats-io/jetstream";
import { DynamicModule, Module } from "@nestjs/common";
import { connect, ConsumerMessages, DiscardPolicy, NatsConnection, RetentionPolicy } from "nats";

import { IEventBoxFactory } from "@/common/events";
import { EventConsumer, EventStream } from "@/common/events/types";
import { NatsJetStreamPubSubClient, PubSubClientToken } from "@/jetstream";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

const NatsJetStreamOptionsToken = Symbol("NatsJetStreamOptions");
const NatsConnectionToken = Symbol("NatsConnection");
const NatsJetStreamClientToken = Symbol("NatsJetStreamClient");
const NatsJetStreamManagerToken = Symbol("NatsJetStreamManager");
export const NatsJetStreamConsumerMessagesToken = Symbol("NatsJetStreamConsumerMessages");

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
                    useFactory: async ({ connection }: NatsJetStreamModuleOptions) => {
                        return await connect({
                            servers: `${connection.host}:${connection.port}`,
                            name: "codename",
                        });
                    },
                    inject: [NatsJetStreamOptionsToken],
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
                            await manager.streams.purge(stream.name);
                        }
                    },
                    inject: [NatsConnectionToken, NatsJetStreamOptionsToken],
                },
            ],
            exports: [NatsJetStreamOptionsToken, NatsConnectionToken, NatsJetStreamManagerToken],
            global: options.global,
        };
    }

    static forFeature<T extends IEventBoxFactory>({ consumers }: { consumers: EventConsumer[] }): DynamicModule {
        return {
            module: NatsJetStreamModule,
            providers: [
                {
                    provide: NatsJetStreamClientToken,
                    useFactory: (connection: NatsConnection) => jetstream(connection),
                    inject: [NatsConnectionToken],
                },

                {
                    provide: `${NatsJetStreamManagerToken.toString()}_ext`,
                    useFactory: async (connection: NatsConnection) => {
                        const manager = await jetstreamManager(connection);

                        for (const consumer of consumers) {
                            try {
                                await manager.consumers.add(consumer.stream, {
                                    name: consumer.name,
                                    durable_name: consumer.name,
                                    filter_subjects: consumer.subjects,
                                    replay_policy: "instant",
                                    ack_policy: "all",
                                });
                            } catch (err) {
                                console.log("\nERROR: ", consumer, "\n");
                            }
                        }
                    },
                    inject: [NatsConnectionToken],
                },

                {
                    provide: PubSubClientToken,
                    useFactory: (client: JetStreamClient) => new NatsJetStreamPubSubClient(client),
                    inject: [NatsJetStreamClientToken],
                },

                {
                    provide: NatsJetStreamConsumerMessagesToken,
                    useFactory: async (client: JetStreamClient) => {
                        const jobs: Promise<ConsumerMessages>[] = [];

                        for await (const consumer of consumers) {
                            const c = await client.consumers.get(consumer.stream, `codename_${consumer.name}`);

                            if (c.isPullConsumer()) {
                                jobs.push(c.consume());
                            }
                        }

                        return jobs;
                    },
                    inject: [NatsJetStreamClientToken],
                },
            ],
            exports: [PubSubClientToken, NatsJetStreamConsumerMessagesToken],
        };
    }
}
