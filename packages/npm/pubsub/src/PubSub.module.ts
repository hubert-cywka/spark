import { DynamicModule, Module, Provider } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

import { IPublisherServiceToken } from "./services/IPublisher.service";
import { PublisherService } from "./services/Publisher.service";

interface PubSubModuleOptions {
    host: string;
    port: number;
}

const MODULE_OPTIONS_TOKEN = Symbol("PubSubModuleOptions");

@Module({}) // TODO: Make it bulletproof
export class PubSubModule {
    static forRoot(options: { pubsub: PubSubModuleOptions; global?: boolean }): DynamicModule {
        const pubSubOptionsProvider: Provider = {
            provide: MODULE_OPTIONS_TOKEN,
            useValue: options.pubsub,
        };

        const publisherProvider: Provider = {
            provide: IPublisherServiceToken,
            useFactory: (pubSubOptions: PubSubModuleOptions) => this.createPublisher(pubSubOptions),
            inject: [MODULE_OPTIONS_TOKEN],
        };

        return {
            module: PubSubModule,
            providers: [pubSubOptionsProvider, publisherProvider],
            exports: [IPublisherServiceToken],
            global: options.global,
        };
    }

    static forRootAsync(options: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        useFactory: (...args: any[]) => PubSubModuleOptions | Promise<PubSubModuleOptions>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        inject?: any[];
        global?: boolean;
    }): DynamicModule {
        const asyncOptionsProvider: Provider = {
            provide: MODULE_OPTIONS_TOKEN,
            useFactory: options.useFactory,
            inject: options.inject || [],
        };

        const publisherProvider: Provider = {
            provide: IPublisherServiceToken,
            useFactory: (pubSubOptions: PubSubModuleOptions) => this.createPublisher(pubSubOptions),
            inject: [MODULE_OPTIONS_TOKEN],
        };

        return {
            module: PubSubModule,
            providers: [asyncOptionsProvider, publisherProvider],
            exports: [IPublisherServiceToken],
            global: options.global,
        };
    }

    private static createPublisher({ host, port }: PubSubModuleOptions) {
        const client = ClientProxyFactory.create({
            transport: Transport.REDIS,
            options: {
                host,
                port,
            },
        });

        return new PublisherService(client);
    }
}
