import { type DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

import { type IntegrationEventsModuleOptions } from "./types";

import { EventBoxFactoryToken, IEventBoxFactory } from "@/common/events/services/IEventBox.factory";
import { EventInboxToken } from "@/common/events/services/IEventInbox";
import { EventOutboxToken } from "@/common/events/services/IEventOutbox";

const IntegrationEventsModuleOptionsToken = Symbol("IntegrationEventsModuleOptions");
export const IntegrationEventsClientProxyToken = Symbol("IntegrationEventsClientProxy");

@Module({})
export class IntegrationEventsModule {
    static forRootAsync(options: {
        useFactory: (...args: any[]) => IntegrationEventsModuleOptions | Promise<IntegrationEventsModuleOptions>; // eslint-disable-line @typescript-eslint/no-explicit-any
        inject?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static forFeature<T extends IEventBoxFactory>(factoryClass: new (...args: any[]) => T, context: string): DynamicModule {
        return {
            module: IntegrationEventsModule,
            providers: [
                {
                    provide: EventBoxFactoryToken,
                    useClass: factoryClass,
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
            ],
            exports: [EventBoxFactoryToken, EventOutboxToken, EventInboxToken],
        };
    }
}
