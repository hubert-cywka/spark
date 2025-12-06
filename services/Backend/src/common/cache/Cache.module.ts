import KeyvRedis from "@keyv/redis";
import { CacheModule as BaseCacheModule } from "@nestjs/cache-manager";
import { DynamicModule, Module } from "@nestjs/common";

import { DistributedCache } from "@/common/cache/services/implementations/DistributedCache";
import { DistributedCacheToken } from "@/common/cache/services/interfaces/ICache";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

type CacheModuleOptions = {
    connectionString: string;
};

@Module({})
export class CacheModule {
    static forRootAsync(options: { useFactory: UseFactory<CacheModuleOptions>; inject?: UseFactoryArgs }): DynamicModule {
        return {
            module: CacheModule,
            providers: [
                {
                    provide: DistributedCacheToken,
                    useClass: DistributedCache,
                },
            ],
            imports: [
                BaseCacheModule.registerAsync({
                    useFactory: async (...args: UseFactoryArgs) => {
                        const cacheOptions = await options.useFactory(...args);

                        return {
                            stores: [new KeyvRedis({ url: cacheOptions.connectionString })],
                        };
                    },
                    inject: options.inject || [],
                }),
            ],
            exports: [CacheModule, DistributedCacheToken],
        };
    }
}
