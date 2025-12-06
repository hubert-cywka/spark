import { Inject } from "@nestjs/common";

import { type IServiceToServiceClient, ServiceToServiceClientToken } from "@/common/s2s/services/interfaces/IServiceToServiceClient";
import { type FeatureFlag } from "@/modules/configuration/models/FeatureFlag.model";
import { type IFeatureFlagsProvider } from "@/modules/configuration/services/interfaces/IFeatureFlagsProvider";
import { type IFeatureFlagsStore, FeatureFlagsStoreToken } from "@/modules/configuration/services/interfaces/IFeatureFlagsStore";

export class FeatureFlagsProvider implements IFeatureFlagsProvider {
    public constructor(
        @Inject(FeatureFlagsStoreToken)
        private readonly store: IFeatureFlagsStore,
        @Inject(ServiceToServiceClientToken)
        private readonly client: IServiceToServiceClient
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
        return await this.client.get<FeatureFlag[]>("configuration", `internal/configuration/feature-flag?key=${key}`);
    }
}
