import { ConsumerMessages } from "@nats-io/jetstream";
import { type DynamicModule, Module } from "@nestjs/common";
import { ClassConstructor, plainToClass } from "class-transformer";

import { NatsJetStreamModule, NatsJetStreamModuleOptions } from "@/common/events/brokers/NatsJetStream.module";
import { EventInbox } from "@/common/events/services/implementations/EventInbox";
import { InboxEventsRemovalJob } from "@/common/events/services/implementations/InboxEventRemoval.job";
import { InboxProcessorJob } from "@/common/events/services/implementations/InboxProcessor.job";
import { OutboxEventsRemovalJob } from "@/common/events/services/implementations/OutboxEventRemoval.job";
import { OutboxProcessorJob } from "@/common/events/services/implementations/OutboxProcessor.job";
import { type IEventBoxFactory, EventBoxFactoryToken } from "@/common/events/services/interfaces/IEventBox.factory";
import { type IEventInbox, EventInboxToken } from "@/common/events/services/interfaces/IEventInbox";
import { EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { type IPubSubConsumer, PubSubConsumerToken } from "@/common/events/services/interfaces/IPubSubConsumer";
import { EventConsumer, IntegrationEventsForFeatureOptions, IntegrationEventsModuleOptions } from "@/common/events/types";
import { IntegrationEvent } from "@/common/events/types/IntegrationEvent";
import { logger } from "@/lib/logger";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

const IntegrationEventsForRootOptionsToken = Symbol("IntegrationEventsForRootOptions");
const IntegrationEventsForFeatureOptionsToken = Symbol("IntegrationEventsForFeatureOptions");

@Module({})
export class IntegrationEventsModule {
    static forRootAsync(options: {
        useFactory: UseFactory<IntegrationEventsModuleOptions<NatsJetStreamModuleOptions>>;
        inject?: UseFactoryArgs;
        global?: boolean;
    }): DynamicModule {
        return {
            module: IntegrationEventsModule,
            providers: [
                {
                    provide: IntegrationEventsForRootOptionsToken,
                    useFactory: options.useFactory,
                    inject: options.inject ?? [],
                },
            ],
            imports: [NatsJetStreamModule.forRootAsync(options)],
            exports: [IntegrationEventsForRootOptionsToken],
            global: options.global,
        };
    }

    static forFeatureAsync<T extends IEventBoxFactory>(options: {
        useFactory: UseFactory<IntegrationEventsForFeatureOptions>;
        inject?: UseFactoryArgs;
        consumers: EventConsumer[];
        eventBoxFactoryClass: ClassConstructor<T>;
        context: string;
    }): DynamicModule {
        return {
            module: IntegrationEventsModule,
            providers: [
                {
                    provide: IntegrationEventsForFeatureOptionsToken,
                    useFactory: options.useFactory,
                    inject: options.inject ?? [],
                },

                {
                    provide: EventBoxFactoryToken,
                    useClass: options.eventBoxFactoryClass,
                },

                {
                    provide: EventOutboxToken,
                    useFactory: (factory: IEventBoxFactory) => factory.createOutbox(`${options.context}_Outbox`),
                    inject: [EventBoxFactoryToken],
                },

                {
                    provide: EventInboxToken,
                    useFactory: (factory: IEventBoxFactory) => factory.createInbox(`${options.context}_Inbox`),
                    inject: [EventBoxFactoryToken],
                },

                {
                    provide: InboxProcessorJob,
                    useFactory: (inbox: IEventInbox, { handlers }: IntegrationEventsForFeatureOptions) =>
                        new InboxProcessorJob(inbox, handlers),
                    inject: [EventInboxToken, IntegrationEventsForFeatureOptionsToken],
                },

                {
                    provide: OutboxProcessorJob,
                    useClass: OutboxProcessorJob,
                },

                {
                    provide: InboxEventsRemovalJob,
                    useClass: InboxEventsRemovalJob,
                },

                {
                    provide: OutboxEventsRemovalJob,
                    useClass: OutboxEventsRemovalJob,
                },

                {
                    // TODO
                    provide: `${options.context}_EventsSubscriber`,
                    useFactory: async (consumer: IPubSubConsumer, inbox: EventInbox) => {
                        const subscriptions = await consumer.subscribe(options.consumers);

                        const listen = async (messages: ConsumerMessages) => {
                            for await (const message of messages) {
                                try {
                                    const event = plainToClass(IntegrationEvent, message.json() as unknown);
                                    logger.log(event, `Received '${event.getTopic()}' event.`);
                                    await inbox.enqueue(event);
                                    message.ack();
                                } catch (err) {
                                    message.nak();
                                }
                            }
                        };

                        void (async () => {
                            for await (const subscription of subscriptions) {
                                void listen(subscription);
                            }
                        })();
                    },
                    inject: [PubSubConsumerToken, EventInboxToken],
                },
            ],

            exports: [EventBoxFactoryToken, EventOutboxToken, EventInboxToken],
        };
    }
}
