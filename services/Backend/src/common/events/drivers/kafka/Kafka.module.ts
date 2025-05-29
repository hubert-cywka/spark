import { DynamicModule, Logger, Module } from "@nestjs/common";
import { type Consumer, Kafka, Producer } from "kafkajs";

import { KafkaConsumer } from "@/common/events/drivers/kafka/services/KafkaConsumer";
import { KafkaLoggerAdapter } from "@/common/events/drivers/kafka/services/KafkaLoggingAdapter";
import { KafkaProducer } from "@/common/events/drivers/kafka/services/KafkaProducer";
import { getPubSubConsumerToken } from "@/common/events/services/interfaces/IPubSubConsumer";
import { getPubSubProducerToken } from "@/common/events/services/interfaces/IPubSubProducer";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

const createKafkaToken = (context: string, name: string): symbol => {
    return Symbol(`Kafka${name}Token_${context}`);
};

export type KafkaModuleOptions = {
    groupId: string;
    clientId: string;
    brokers: string[];
};

@Module({})
export class KafkaModule {
    static forFeatureAsync(
        context: string,
        options: { useFactory: UseFactory<KafkaModuleOptions>; inject?: UseFactoryArgs }
    ): DynamicModule {
        const KafkaOptionsToken = createKafkaToken(context, "Options");
        const KafkaClientToken = createKafkaToken(context, "Client");
        const KafkaProducerToken = createKafkaToken(context, "Producer");
        const KafkaConsumerToken = createKafkaToken(context, "Consumer");
        const PubSubProducerTokenForContext = getPubSubProducerToken(context);
        const PubSubConsumerTokenForContext = getPubSubConsumerToken(context);

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
                    useFactory: (options: KafkaModuleOptions) => {
                        const loggerAdapter = new KafkaLoggerAdapter(new Logger(`KafkaClient_${context}`));
                        return new Kafka({
                            clientId: options.clientId,
                            brokers: options.brokers,
                            logCreator: (level) => (entry) => loggerAdapter.log(level, entry),
                        });
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
                        return consumer;
                    },
                    inject: [KafkaClientToken, KafkaOptionsToken],
                },

                {
                    provide: PubSubProducerTokenForContext,
                    useFactory: (producer: Producer) => {
                        return new KafkaProducer(producer);
                    },
                    inject: [KafkaProducerToken],
                },

                {
                    provide: PubSubConsumerTokenForContext,
                    useFactory: async (consumer: Consumer) => {
                        return new KafkaConsumer(consumer);
                    },
                    inject: [KafkaConsumerToken],
                },
            ],
            exports: [PubSubConsumerTokenForContext, PubSubProducerTokenForContext],
        };
    }
}
