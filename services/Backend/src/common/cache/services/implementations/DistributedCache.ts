import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject } from "@nestjs/common";

import { cacheMetrics } from "@/common/cache/observability/metrics";
import { IDistributedCache } from "@/common/cache/services/interfaces/ICache";

export class DistributedCache implements IDistributedCache {
    public constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    async get<T>(key: string): Promise<T | null> {
        const value = await this.cacheManager.get<T>(key);

        if (value) {
            cacheMetrics.cacheHit.add(1, { key });
        } else {
            cacheMetrics.cacheMiss.add(1, { key });
        }

        return value ?? null;
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<T> {
        cacheMetrics.cacheSet.add(1, { key });
        return await this.cacheManager.set(key, value, ttl);
    }

    async delete(key: string): Promise<boolean> {
        cacheMetrics.cacheDelete.add(1, { key });
        return await this.cacheManager.del(key);
    }
}
