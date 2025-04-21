import { ConsumerMessages } from "@nats-io/jetstream";
import { type DynamicModule, Module } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { plainToClass } from "class-transformer";
import { CronJob } from "cron";
import dayjs from "dayjs";

import { NatsJetStreamModule, NatsJetStreamModuleOptions } from "@/common/events/brokers/NatsJetStream.module";
import { EventInbox } from "@/common/events/services/implementations/EventInbox";
import { EventBoxFactoryToken, IEventBoxFactory } from "@/common/events/services/interfaces/IEventBox.factory";
import { EventInboxToken, IEventInbox } from "@/common/events/services/interfaces/IEventInbox";
import { type IEventOutbox, EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { type IPubSubClient, PubSubClientToken } from "@/common/events/services/interfaces/IPubSubClient";
import { EventConsumer, IntegrationEventsModuleOptions } from "@/common/events/types";
import { IntegrationEvent } from "@/common/events/types/IntegrationEvent";
import { logger } from "@/lib/logger";
import { ClassConstructor } from "@/types/Class";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

const EVENTS_RETENTION_PERIOD_IN_DAYS = 7;

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
                    inject: options.inject || [],
                },
            ],
            imports: [NatsJetStreamModule.forRootAsync(options)],
            exports: [IntegrationEventsModuleOptionsToken],
            global: options.global,
        };
    }

    static forFeature<T extends IEventBoxFactory>({
        consumers,
        eventBoxFactoryClass,
        context,
        outboxProcessingInterval = 5000,
    }: {
        consumers: EventConsumer[];
        eventBoxFactoryClass: ClassConstructor<T>;
        context: string;
        outboxProcessingInterval?: number;
    }): DynamicModule {
        return {
            module: IntegrationEventsModule,
            providers: [
                {
                    provide: EventBoxFactoryToken,
                    useClass: eventBoxFactoryClass,
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
                    provide: `${context}_OutboxProcessorJob`,
                    useFactory: (schedulerRegistry: SchedulerRegistry, outbox: IEventOutbox) => {
                        const interval = setInterval(async () => await outbox.process(), outboxProcessingInterval);
                        schedulerRegistry.addInterval(`${context}_OutboxProcessor`, interval);
                        return interval;
                    },
                    inject: [SchedulerRegistry, EventOutboxToken],
                },

                {
                    provide: `${context}_OutboxCleanerJob`,
                    useFactory: (schedulerRegistry: SchedulerRegistry, outbox: IEventOutbox) => {
                        const job = new CronJob(CronExpression.EVERY_DAY_AT_3AM, async () => {
                            const processedBefore = dayjs().subtract(EVENTS_RETENTION_PERIOD_IN_DAYS, "days").toDate();
                            await outbox.clearProcessedEvents(processedBefore);
                        });

                        schedulerRegistry.addCronJob(`${context}_OutboxCleaner`, job);
                        return job;
                    },
                    inject: [SchedulerRegistry, EventOutboxToken],
                },

                {
                    provide: `${context}_InboxCleanerJob`,
                    useFactory: (schedulerRegistry: SchedulerRegistry, inbox: IEventInbox) => {
                        const job = new CronJob(CronExpression.EVERY_DAY_AT_4AM, async () => {
                            const processedBefore = dayjs().subtract(EVENTS_RETENTION_PERIOD_IN_DAYS, "days").toDate();
                            await inbox.clearProcessedEvents(processedBefore);
                        });

                        schedulerRegistry.addCronJob(`${context}_InboxCleaner`, job);
                        return job;
                    },
                    inject: [SchedulerRegistry, EventOutboxToken],
                },

                {
                    provide: `${context}_EventsSubscriber`,
                    useFactory: async (client: IPubSubClient, inbox: EventInbox) => {
                        const subscriptions = await client.subscribe(consumers);

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
                    inject: [PubSubClientToken, EventInboxToken],
                },
            ],

            exports: [EventBoxFactoryToken, EventOutboxToken, EventInboxToken],
        };
    }
}
