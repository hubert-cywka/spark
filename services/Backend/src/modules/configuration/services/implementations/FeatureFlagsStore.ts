import { Inject } from "@nestjs/common";

import { type IDistributedCache, DistributedCacheToken } from "@/common/cache/services/interfaces/IDistributedCache";
import { type FeatureFlag } from "@/modules/configuration/models/FeatureFlag.model";
import { type IFeatureFlagsStore } from "@/modules/configuration/services/interfaces/IFeatureFlagsStore";

export class FeatureFlagsStore implements IFeatureFlagsStore {
    private readonly cacheKeyPrefix = "__featureFlags:";

    public constructor(
        @Inject(DistributedCacheToken)
        private readonly cache: IDistributedCache
    ) {}

    public async get(key: string): Promise<FeatureFlag[] | null> {
        return await this.cache.get<FeatureFlag[]>(this.getCacheKey(key));
    }

    public async update(key: string, flags: FeatureFlag[]): Promise<void> {
        await this.cache.set(this.getCacheKey(key), flags);
    }

    public async clear(key: string): Promise<void> {
        await this.cache.delete(this.getCacheKey(key));
    }

    private getCacheKey(key: string) {
        return `${this.cacheKeyPrefix}${key}`;
    }
}
