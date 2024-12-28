import { type DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

import { type IntegrationEventsModuleOptions } from "./types";

export const IntegrationEventsModuleOptionsToken = Symbol("IntegrationEventsModuleOptions");
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
}
