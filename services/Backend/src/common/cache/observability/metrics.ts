import { ValueType } from "@opentelemetry/api";

import { otelMeter } from "@/common/observability/metrics";

const distributedCacheHitCounter = otelMeter.createCounter("distributed_cache_hit_total", {
    description: "Total number of successful cache hits (data found in distributed cache)",
    unit: "1",
    valueType: ValueType.INT,
});

const distributedCacheMissCounter = otelMeter.createCounter("distributed_cache_miss_total", {
    description: "Total number of cache misses (data not found in distributed cache)",
    unit: "1",
    valueType: ValueType.INT,
});

const distributedCacheSetCounter = otelMeter.createCounter("distributed_cache_set_total", {
    description: "Total number of items successfully set/updated in the distributed cache",
    unit: "1",
    valueType: ValueType.INT,
});

const distributedCacheDeleteCounter = otelMeter.createCounter("distributed_cache_delete_total", {
    description: "Total number of items successfully deleted from the distributed cache",
    unit: "1",
    valueType: ValueType.INT,
});

export const cacheMetrics = {
    cacheHit: distributedCacheHitCounter,
    cacheMiss: distributedCacheMissCounter,
    cacheSet: distributedCacheSetCounter,
    cacheDelete: distributedCacheDeleteCounter,
};
