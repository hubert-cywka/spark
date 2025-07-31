import { DynamicModule, Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type Consumer, type Producer, Admin, Kafka } from "kafkajs";

import { EventAdminToken } from "@/common/events/drivers/interfaces/IEventAdmin";
import { EventConsumerToken } from "@/common/events/drivers/interfaces/IEventConsumer";
import { EventProducerToken } from "@/common/events/drivers/interfaces/IEventProducer";
import { KafkaAdmin } from "@/common/events/drivers/kafka/services/KafkaAdmin";
import { KafkaConsumer } from "@/common/events/drivers/kafka/services/KafkaConsumer";
import { KafkaLoggerAdapter } from "@/common/events/drivers/kafka/services/KafkaLoggingAdapter";
import { KafkaProducer } from "@/common/events/drivers/kafka/services/KafkaProducer";
import { LinearRetryBackoffPolicy } from "@/common/retry/LinearRetryBackoffPolicy";
import { withRetry } from "@/common/retry/withRetry";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

const CONNECTION_INITIALIZATION_MAX_ATTEMPTS = 15;
const CONNECTION_INITIALIZATION_BASE_INTERVAL = 1_000;

const KafkaOptionsToken = Symbol("KafkaOptionsToken");
const KafkaAdminToken = Symbol("KafkaAdminToken");
const KafkaProducerToken = Symbol("KafkaProducerToken");
const KafkaConsumerToken = Symbol("KafkaConsumerToken");

export type KafkaModuleOptions = {
    groupId: string;
    clientId: string;
    brokers: string[];
};

export type KafkaForFeatureOptions = Pick<KafkaModuleOptions, "brokers" | "clientId">;

@Module({})
export class KafkaModule implements OnApplicationShutdown {
    private static readonly logger = new Logger(KafkaModule.name);
    private static readonly admins: Admin[] = [];
    private static readonly consumers: Consumer[] = [];
    private static readonly producers: Producer[] = [];

    async onApplicationShutdown() {
        KafkaModule.logger.log("Disconnecting kafka consumers and producers.");

        try {
            await Promise.all([
                ...KafkaModule.admins.map((admin) => admin.disconnect()),
                ...KafkaModule.consumers.map((consumer) => consumer.disconnect()),
                ...KafkaModule.producers.map((producer) => producer.disconnect()),
            ]);
            KafkaModule.logger.log("Disconnected all kafka admins, consumers and producers.");
        } catch (error) {
            KafkaModule.logger.error(error, "Error occurred when disconnecting kafka admins, consumers and producers.");
        }
    }

    private static trackAdmin(admin: Admin) {
        KafkaModule.admins.push(admin);
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
                    provide: KafkaAdminToken,
                    useFactory: async (client: Kafka) => {
                        const admin = client.admin();
                        await admin.connect();
                        KafkaModule.trackAdmin(admin);

                        logger.log("Admin connected.");
                        return admin;
                    },
                    inject: [KafkaClientToken],
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
                    provide: EventAdminToken,
                    useFactory: (admin: Admin) => {
                        return new KafkaAdmin(admin);
                    },
                    inject: [KafkaAdminToken],
                },

                {
                    provide: EventProducerToken,
                    useFactory: (producer: Producer) => {
                        return new KafkaProducer(producer);
                    },
                    inject: [KafkaProducerToken],
                },

                {
                    provide: EventConsumerToken,
                    useFactory: async (consumer: Consumer, config: ConfigService) => {
                        return new KafkaConsumer(consumer, config.getOrThrow<number>("pubsub.consumer.concurrentPartitions"));
                    },
                    inject: [KafkaConsumerToken, ConfigService],
                },
            ],
            exports: [EventConsumerToken, EventProducerToken, EventAdminToken],
        };
    }
}
