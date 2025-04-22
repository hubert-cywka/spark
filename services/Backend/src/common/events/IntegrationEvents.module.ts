import { ConsumerMessages } from "@nats-io/jetstream";
import { type DynamicModule, Module } from "@nestjs/common";
import { ClassConstructor, plainToClass } from "class-transformer";

import { NatsJetStreamModule, NatsJetStreamModuleOptions } from "@/common/events/brokers/NatsJetStream.module";
import { EventInbox } from "@/common/events/services/implementations/EventInbox";
import { InboxEventsRemovalJob } from "@/common/events/services/implementations/InboxEventRemoval.job";
import { OutboxEventsRemovalJob } from "@/common/events/services/implementations/OutboxEventRemoval.job";
import { type IEventBoxFactory, EventBoxFactoryToken } from "@/common/events/services/interfaces/IEventBox.factory";
import { EventInboxToken } from "@/common/events/services/interfaces/IEventInbox";
import { EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { type IPubSubConsumer, PubSubConsumerToken } from "@/common/events/services/interfaces/IPubSubConsumer";
import { EventConsumer, IntegrationEventsModuleOptions } from "@/common/events/types";
import { IntegrationEvent } from "@/common/events/types/IntegrationEvent";
import { logger } from "@/lib/logger";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

const IntegrationEventsModuleOptionsToken = Symbol("IntegrationEventsModuleOptions");

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
                    provide: IntegrationEventsModuleOptionsToken,
                    useFactory: options.useFactory,
                    inject: options.inject ?? [],
                },
            ],
            imports: [NatsJetStreamModule.forRootAsync(options)],
            exports: [IntegrationEventsModuleOptionsToken],
            global: options.global,
        };
    }

    static forFeature<T extends IEventBoxFactory>({
        consumers,
        eventBoxFactory,
        context,
    }: {
        consumers: EventConsumer[];
        eventBoxFactory: {
            useClass: ClassConstructor<T>;
        };
        context: string;
    }): DynamicModule {
        return {
            module: IntegrationEventsModule,
            providers: [
                {
                    provide: EventBoxFactoryToken,
                    useClass: eventBoxFactory.useClass,
                },

                {
                    provide: EventOutboxToken,
                    useFactory: (factory: IEventBoxFactory) => factory.createOutbox(`${context}_Outbox`),
                    inject: [EventBoxFactoryToken],
                },

                {
                    provide: EventInboxToken,
                    useFactory: (factory: IEventBoxFactory) => factory.createInbox(`${context}_Inbox`),
                    inject: [EventBoxFactoryToken],
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
                    provide: `${context}_EventsSubscriber`,
                    useFactory: async (consumer: IPubSubConsumer, inbox: EventInbox) => {
                        const subscriptions = await consumer.subscribe(consumers);

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
