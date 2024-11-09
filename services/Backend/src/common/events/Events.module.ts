import { type DynamicModule, type Provider, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

import { IPublisherServiceToken } from "./services/IPublisher.service";
import { PublisherService } from "./services/Publisher.service";
import { type EventsModuleOptions } from "./types";

const MODULE_OPTIONS_TOKEN = Symbol("PubSubModuleOptions");

@Module({}) // TODO: Make it bulletproof, try to implement at-least-once delivery
export class EventsModule {
    static forRootAsync(options: {
        useFactory: (...args: any[]) => EventsModuleOptions | Promise<EventsModuleOptions>; // eslint-disable-line @typescript-eslint/no-explicit-any
        inject?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
        global?: boolean;
    }): DynamicModule {
        const asyncOptionsProvider: Provider = {
            provide: MODULE_OPTIONS_TOKEN,
            useFactory: options.useFactory,
            inject: options.inject || [],
        };

        const publisherProvider: Provider = {
            provide: IPublisherServiceToken,
            useFactory: (moduleOptions: EventsModuleOptions) => {
                const client = ClientProxyFactory.create({
                    transport: Transport.REDIS,
                    options: moduleOptions.connection,
                });
                return new PublisherService(client);
            },
            inject: [MODULE_OPTIONS_TOKEN],
        };

        return {
            module: EventsModule,
            providers: [asyncOptionsProvider, publisherProvider],
            exports: [IPublisherServiceToken],
            global: options.global,
        };
    }
}
