import type { FeatureFlag } from "@/modules/configuration/models/FeatureFlag.model";
import { type FeatureFlagsFilter } from "@/modules/configuration/models/FeatureFlagFilters.model";

export const FeatureFlagServiceToken = Symbol("FeatureFlagServiceToken");

export interface IFeatureFlagService {
    get(filters: FeatureFlagsFilter): Promise<FeatureFlag[]>;
    set(tenantId: string, key: string, value: boolean): Promise<void>;
    remove(id: string): Promise<void>;
}
