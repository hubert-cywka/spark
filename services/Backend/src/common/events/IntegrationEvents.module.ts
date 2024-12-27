import { type DynamicModule, type Provider, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

import { EventPublisherService } from "./services/EventPublisher.service";
import { IEventPublisherServiceToken } from "./services/IEventPublisher.service";
import { type IntegrationEventsModuleOptions } from "./types";

const MODULE_OPTIONS_TOKEN = Symbol("PubSubModuleOptions");

@Module({})
export class IntegrationEventsModule {
    static forRootAsync(options: {
        useFactory: (...args: any[]) => IntegrationEventsModuleOptions | Promise<IntegrationEventsModuleOptions>; // eslint-disable-line @typescript-eslint/no-explicit-any
        inject?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
        global?: boolean;
    }): DynamicModule {
        const asyncOptionsProvider: Provider = {
            provide: MODULE_OPTIONS_TOKEN,
            useFactory: options.useFactory,
            inject: options.inject || [],
        };

        const publisherProvider: Provider = {
            provide: IEventPublisherServiceToken,
            useFactory: (moduleOptions: IntegrationEventsModuleOptions) => {
                const client = ClientProxyFactory.create({
                    transport: Transport.REDIS,
                    options: moduleOptions.connection,
                });
                return new EventPublisherService(client);
            },
            inject: [MODULE_OPTIONS_TOKEN],
        };

        return {
            module: IntegrationEventsModule,
            providers: [asyncOptionsProvider, publisherProvider],
            exports: [IEventPublisherServiceToken],
            global: options.global,
        };
    }
}
