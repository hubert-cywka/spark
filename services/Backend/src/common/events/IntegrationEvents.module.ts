import { type DynamicModule, Module } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { NatsJetStreamTransport } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { CronJob } from "cron";
import dayjs from "dayjs";

import { EventBoxFactoryToken, IEventBoxFactory } from "@/common/events/services/interfaces/IEventBox.factory";
import { EventInboxToken, IEventInbox } from "@/common/events/services/interfaces/IEventInbox";
import { type IEventOutbox, EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { IntegrationEventsModuleOptions } from "@/common/events/types";
import { ClassConstructor } from "@/types/Class";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

const EVENTS_RETENTION_PERIOD_IN_DAYS = 7;

const IntegrationEventsModuleOptionsToken = Symbol("IntegrationEventsModuleOptions");

@Module({})
export class IntegrationEventsModule {
    static forRootAsync(options: {
        useFactory: UseFactory<IntegrationEventsModuleOptions>;
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
            exports: [IntegrationEventsModuleOptionsToken],
            global: options.global,
        };
    }

    static forFeature<T extends IEventBoxFactory>({
        eventBoxFactoryClass,
        context,
        outboxProcessingInterval = 5000,
    }: {
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
                        schedulerRegistry.addCronJob(`${context}_OutboxCleaner`, job);
                        return job;
                    },
                    inject: [SchedulerRegistry, EventOutboxToken],
                },
            ],
            imports: [
                NatsJetStreamTransport.registerAsync({
                    useFactory: ({ connection }: IntegrationEventsModuleOptions) => {
                        return {
                            connectionOptions: {
                                servers: `${connection.host}:${connection.port}`,
                                name: `${context}_JetStreamPublisher`,
                            },
                        };
                    },
                    inject: [IntegrationEventsModuleOptionsToken],
                }),
            ],
            exports: [EventBoxFactoryToken, EventOutboxToken, EventInboxToken],
        };
    }
}
