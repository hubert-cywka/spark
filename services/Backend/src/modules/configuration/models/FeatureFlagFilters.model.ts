import { type FeatureFlag } from "@/modules/configuration/models/FeatureFlag.model";

export type FeatureFlagsFilter = Partial<Pick<FeatureFlag, "key" | "tenantId">>;
