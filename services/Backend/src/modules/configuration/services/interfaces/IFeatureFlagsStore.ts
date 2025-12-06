import type { FeatureFlag } from "@/modules/configuration/models/FeatureFlag.model";

export const FeatureFlagsStoreToken = Symbol("FeatureFlagsStoreToken");

export interface IFeatureFlagsStore {
    get(key: string): Promise<FeatureFlag[] | null>;
    update(key: string, flags: FeatureFlag[]): Promise<void>;
    clear(key: string): Promise<void>;
}
