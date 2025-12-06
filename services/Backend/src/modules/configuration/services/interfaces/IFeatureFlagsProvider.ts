import type { FeatureFlag } from "@/modules/configuration/models/FeatureFlag.model";

export const FeatureFlagsProviderToken = Symbol("FeatureFlagsProvider");

export interface IFeatureFlagsProvider {
    get(tenantId: string, key: string): Promise<FeatureFlag | null>;
}
