import { DynamicModule, Module } from "@nestjs/common";

import { ServiceToServiceClient } from "@/common/s2s/services/implementations/ServiceToServiceClient";
import { ServiceToServiceClientToken } from "@/common/s2s/services/interfaces/IServiceToServiceClient";
import { type ServiceToServiceProxyOptions } from "@/common/s2s/types/ServiceToServiceProxyOptions";
import { type UseFactory, type UseFactoryArgs } from "@/types/UseFactory";

type ServiceToServiceModuleOptions = {
    proxy: ServiceToServiceProxyOptions;
};

@Module({})
export class ServiceToServiceModule {
    static forRootAsync(options: {
        useFactory: UseFactory<ServiceToServiceModuleOptions>;
        inject?: UseFactoryArgs;
        global?: boolean;
    }): DynamicModule {
        return {
            module: ServiceToServiceModule,
            global: options.global,
            providers: [
                {
                    provide: ServiceToServiceClientToken,
                    useFactory: async (...args: UseFactoryArgs) => {
                        const { proxy } = await options.useFactory(...args);
                        return new ServiceToServiceClient(proxy);
                    },
                    inject: options.inject || [],
                },
            ],
            
            
            
            exports: [ServiceToServiceClientToken],
        };
    }
}
