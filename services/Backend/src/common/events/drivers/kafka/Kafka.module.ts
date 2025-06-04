import { DynamicModule, Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type Consumer, type Producer, Kafka } from "kafkajs";

import { KafkaConsumer } from "@/common/events/drivers/kafka/services/KafkaConsumer";
import { KafkaLoggerAdapter } from "@/common/events/drivers/kafka/services/KafkaLoggingAdapter";
import { KafkaProducer } from "@/common/events/drivers/kafka/services/KafkaProducer";
import { PubSubConsumerToken } from "@/common/events/services/interfaces/IPubSubConsumer";
import { PubSubProducerToken } from "@/common/events/services/interfaces/IPubSubProducer";
import { LinearRetryBackoffPolicy } from "@/common/retry/LinearRetryBackoffPolicy";
import { withRetry } from "@/common/retry/withRetry";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

const CONNECTION_INITIALIZATION_MAX_ATTEMPTS = 15;
const CONNECTION_INITIALIZATION_BASE_INTERVAL = 1_000;

const KafkaOptionsToken = Symbol("KafkaOptionsToken");
const KafkaProducerToken = Symbol("KafkaProducerToken");
const KafkaConsumerToken = Symbol("KafkaConsumerToken");

export type KafkaModuleOptions = {
    groupId: string;
    clientId: string;
    brokers: string[];
};

export type KafkaForFeatureOptions = Pick<KafkaModuleOptions, "brokers" | "clientId">;

// TODO: Use https://www.npmjs.com/package/@confluentinc/kafka-javascript
@Module({})
export class KafkaModule implements OnApplicationShutdown {
    private static readonly logger = new Logger(KafkaModule.name);
    private static readonly consumers: Consumer[] = [];
    private static readonly producers: Producer[] = [];

    async onApplicationShutdown() {
        KafkaModule.logger.log("Disconnecting kafka consumers and producers.");

        try {
            await Promise.all([
                ...KafkaModule.consumers.map((consumer) => consumer.disconnect()),
                ...KafkaModule.producers.map((producer) => producer.disconnect()),
            ]);
            KafkaModule.logger.log("Disconnected all kafka consumers and producers.");
        } catch (error) {
            KafkaModule.logger.error(error, "Error occurred when disconnecting kafka consumers and producers.");
        }
    }

    private static trackConsumer(consumer: Consumer) {
        KafkaModule.consumers.push(consumer);
    }

    private static trackProducer(producer: Producer) {
        KafkaModule.producers.push(producer);
    }

    private static async initializeConnection(client: Kafka, context: string) {
        const retryPolicy = new LinearRetryBackoffPolicy(CONNECTION_INITIALIZATION_BASE_INTERVAL);

        await withRetry(
            async (attempt) => {
                KafkaModule.logger.log({ attempt, context }, "Trying to connect to kafka.");
                const admin = client.admin();
                await admin.connect();
                await admin.disconnect();
            },
            {
                retryPolicy,
                maxAttempts: CONNECTION_INITIALIZATION_MAX_ATTEMPTS,
                onSuccess: (attempt) => KafkaModule.logger.log({ attempt, context }, "Connected to kafka."),
                onFailure: (error) => KafkaModule.logger.warn(error, "Failed to connect to kafka."),
            }
        );
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

                        await KafkaModule.initializeConnection(client, context);
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
                        KafkaModule.trackProducer(producer);

                        logger.log("Producer connected.");
                        return producer;
                    },
                    inject: [KafkaClientToken],
                },

                {
                    provide: KafkaConsumerToken,
                    useFactory: async (client: Kafka, options: KafkaModuleOptions, config: ConfigService) => {
                        const consumer = client.consumer({
                            groupId: options.groupId,
                            allowAutoTopicCreation: true,
                            maxWaitTimeInMs: config.getOrThrow<number>("pubsub.consumer.maxWaitTimeForBatchInMs"),
                            maxBytes: config.getOrThrow<number>("pubsub.consumer.maxBytesPerBatch"),
                        });
                        await consumer.connect();
                        KafkaModule.trackConsumer(consumer);

                        logger.log("Consumer connected.");
                        return consumer;
                    },
                    inject: [KafkaClientToken, KafkaOptionsToken, ConfigService],
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
                    useFactory: async (consumer: Consumer, config: ConfigService) => {
                        return new KafkaConsumer(consumer, config.getOrThrow<number>("pubsub.consumer.concurrentPartitions"));
                    },
                    inject: [KafkaConsumerToken, ConfigService],
                },
            ],
            exports: [PubSubConsumerToken, PubSubProducerToken, KafkaClientToken],
        };
    }
}
