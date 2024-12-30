import { type DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { SchedulerRegistry } from "@nestjs/schedule";

import { type IntegrationEventsModuleOptions } from "./types";

import { EventBoxFactoryToken, IEventBoxFactory } from "@/common/events/services/interfaces/IEventBox.factory";
import { EventInboxToken } from "@/common/events/services/interfaces/IEventInbox";
import { type IEventOutbox, EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";

const IntegrationEventsModuleOptionsToken = Symbol("IntegrationEventsModuleOptions");
export const IntegrationEventsClientProxyToken = Symbol("IntegrationEventsClientProxy");

@Module({})
export class IntegrationEventsModule {
    static forRootAsync(options: {
        // TODO: Types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        useFactory: (...args: any[]) => IntegrationEventsModuleOptions | Promise<IntegrationEventsModuleOptions>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        inject?: any[];
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
                {
                    provide: IntegrationEventsClientProxyToken,
                    useFactory: (moduleOptions: IntegrationEventsModuleOptions) => {
                        return ClientProxyFactory.create({
                            transport: Transport.REDIS,
                            options: moduleOptions.connection,
                        });
                    },
                    inject: [IntegrationEventsModuleOptionsToken],
                },
            ],
            exports: [IntegrationEventsClientProxyToken],
            global: options.global,
        };
    }

    static forFeature<T extends IEventBoxFactory>({
        eventBoxFactoryClass,
        context,
        outboxProcessingInterval = 5000,
    }: {
        // TODO: Types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        eventBoxFactoryClass: new (...args: any[]) => T;
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
            ],
            exports: [EventBoxFactoryToken, EventOutboxToken, EventInboxToken],
        };
    }
}
