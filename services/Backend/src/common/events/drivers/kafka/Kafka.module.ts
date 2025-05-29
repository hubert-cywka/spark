import { DynamicModule, Inject, Logger, Module, OnModuleDestroy } from "@nestjs/common";
import { type Consumer, type Producer, Kafka } from "kafkajs";

import { KafkaConsumer } from "@/common/events/drivers/kafka/services/KafkaConsumer";
import { KafkaLoggerAdapter } from "@/common/events/drivers/kafka/services/KafkaLoggingAdapter";
import { KafkaProducer } from "@/common/events/drivers/kafka/services/KafkaProducer";
import { PubSubConsumerToken } from "@/common/events/services/interfaces/IPubSubConsumer";
import { PubSubProducerToken } from "@/common/events/services/interfaces/IPubSubProducer";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

export const KafkaOptionsToken = Symbol("KafkaOptionsToken");
export const KafkaProducerToken = Symbol("KafkaProducerToken");
export const KafkaConsumerToken = Symbol("KafkaConsumerToken");

export type KafkaModuleOptions = {
    groupId: string;
    clientId: string;
    brokers: string[];
};

export type KafkaForFeatureOptions = Pick<KafkaModuleOptions, "brokers" | "clientId">;

@Module({})
export class KafkaModule implements OnModuleDestroy {
    constructor(
        @Inject(KafkaConsumerToken)
        private readonly consumer: Consumer,
        @Inject(KafkaProducerToken)
        private readonly producer: Producer
    ) {}

    async onModuleDestroy() {
        await Promise.all([await this.consumer.disconnect(), await this.producer.disconnect()]);
    }

    static forFeatureAsync(
        context: string,
        options: {
            useFactory: UseFactory<KafkaModuleOptions>;
            inject?: UseFactoryArgs;
        }
    ): DynamicModule {
        const logger = new Logger(`KafkaModule_${context}`);
        const KafkaClientToken = Symbol(`KafkaClientToken_${context}`);

        return {
            module: KafkaModule,
            providers: [
                {
                    provide: KafkaOptionsToken,
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },

                {
                    provide: KafkaClientToken,
                    useFactory: async (opts: KafkaModuleOptions) => {
                        const loggerAdapter = new KafkaLoggerAdapter(logger);
                        const client = new Kafka({
                            clientId: opts.clientId,
                            brokers: opts.brokers,
                            logCreator: (level) => (entry) => loggerAdapter.log(level, entry),
                        });

                        let ok = false;

                        while (!ok) {
                            try {
                                await client.admin().connect();
                                ok = true;
                            } catch (err) {
                                // TODO: Improve it
                            }
                        }

                        return client;
                    },
                    inject: [KafkaOptionsToken],
                },

                {
                    provide: KafkaProducerToken,
                    useFactory: async (client: Kafka) => {
                        const producer = client.producer({
                            allowAutoTopicCreation: true,
                        });
                        await producer.connect();
                        logger.log("Producer connected.");
                        return producer;
                    },
                    inject: [KafkaClientToken],
                },

                {
                    provide: KafkaConsumerToken,
                    useFactory: async (client: Kafka, options: KafkaModuleOptions) => {
                        const consumer = client.consumer({
                            groupId: options.groupId,
                            allowAutoTopicCreation: true,
                        });
                        await consumer.connect();
                        logger.log("Consumer connected.");
                        return consumer;
                    },
                    inject: [KafkaClientToken, KafkaOptionsToken],
                },

                {
                    provide: PubSubProducerToken,
                    useFactory: (producer: Producer) => {
                        return new KafkaProducer(producer);
                    },
                    inject: [KafkaProducerToken],
                },

                {
                    provide: PubSubConsumerToken,
                    useFactory: async (consumer: Consumer) => {
                        return new KafkaConsumer(consumer);
                    },
                    inject: [KafkaConsumerToken],
                },
            ],
            exports: [PubSubConsumerToken, PubSubProducerToken],
        };
    }
}
