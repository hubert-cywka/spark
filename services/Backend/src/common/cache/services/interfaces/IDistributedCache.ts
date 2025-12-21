export const InMemoryCacheToken = Symbol("InMemoryCacheToken");
export const DistributedCacheToken = Symbol("DistributedCacheToken");

export interface IDistributedCache {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<T>;
    delete(key: string): Promise<boolean>;
}
