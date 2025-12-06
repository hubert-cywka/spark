import { Inject } from "@nestjs/common";

import { type FeatureFlag } from "@/modules/configuration/models/FeatureFlag.model";
import { type IFeatureFlagsProvider } from "@/modules/configuration/services/interfaces/IFeatureFlagsProvider";
import { type IFeatureFlagsStore, FeatureFlagsStoreToken } from "@/modules/configuration/services/interfaces/IFeatureFlagsStore";

// TODO: Register in a shared module
export class FeatureFlagsProvider implements IFeatureFlagsProvider {
    public constructor(
        @Inject(FeatureFlagsStoreToken)
        private readonly store: IFeatureFlagsStore
    ) {}

    public async get(tenantId: string, key: string): Promise<FeatureFlag | null> {
        const flags = await this.getAllByKey(key);
        return flags.find((flag) => flag.tenantId === tenantId) ?? null;
    }

    private async getAllByKey(key: string) {
        let flags = await this.store.get(key);

        if (flags) {
            return flags;
        }

        flags = await this.fetchAllByKey(key);
        await this.store.update(key, flags);
        return flags;
    }

    private async fetchAllByKey(key: string): Promise<FeatureFlag[]> {
        // TODO: Fetch from service
    }
}
