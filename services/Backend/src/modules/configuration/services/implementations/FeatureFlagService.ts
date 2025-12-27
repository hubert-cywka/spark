import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { type IDatabaseLockService, DatabaseLockServiceToken } from "@/common/database/services/IDatabaseLockService";
import { FeatureFlagEntity } from "@/modules/configuration/entities/FeatureFlag.entity";
import { CONFIGURATION_MODULE_DATA_SOURCE } from "@/modules/configuration/infrastructure/database/constants";
import { type IFeatureFlagMapper, FeatureFlagMapperToken } from "@/modules/configuration/mappers/IFeatureFlag.mapper";
import { type FeatureFlag } from "@/modules/configuration/models/FeatureFlag.model";
import { type FeatureFlagsFilter } from "@/modules/configuration/models/FeatureFlagFilters.model";
import { type IFeatureFlagService } from "@/modules/configuration/services/interfaces/IFeatureFlagService";
import { type IFeatureFlagsStore, FeatureFlagsStoreToken } from "@/modules/configuration/services/interfaces/IFeatureFlagsStore";

@Injectable()
export class FeatureFlagService implements IFeatureFlagService {
    private readonly logger = new Logger(FeatureFlagService.name);

    public constructor(
        @InjectRepository(FeatureFlagEntity, CONFIGURATION_MODULE_DATA_SOURCE)
        private readonly repository: Repository<FeatureFlagEntity>,
        @Inject(FeatureFlagMapperToken)
        private readonly featureFlagMapper: IFeatureFlagMapper,
        @Inject(FeatureFlagsStoreToken)
        private readonly store: IFeatureFlagsStore,
        @Inject(DatabaseLockServiceToken)
        private readonly dbLockService: IDatabaseLockService
    ) {}

    public async get(flagsFilter: FeatureFlagsFilter): Promise<FeatureFlag[]> {
        const repository = this.getRepository();

        const flags = await repository.find({
            where: flagsFilter,
        });

        return this.featureFlagMapper.fromEntityToModelBulk(flags);
    }

    @Transactional({ connectionName: CONFIGURATION_MODULE_DATA_SOURCE })
    public async set(tenantIds: string[], key: string, value: boolean): Promise<void> {
        const repository = this.getRepository();
        const conflictKeys = ["key", "tenantId"] as const satisfies (keyof FeatureFlagEntity)[];

        const flags = tenantIds.map((tenantId) => ({
            tenantId: tenantId,
            key: key,
            value: value,
        }));

        await this.dbLockService.acquireTransactionLock(this.getUpdateFeatureFlagLockId(key));
        await repository.upsert(flags, conflictKeys);
        await this.invalidateCache(key);

        this.logger.debug({ tenantIds, key, value }, "Feature flag set.");
    }

    @Transactional({ connectionName: CONFIGURATION_MODULE_DATA_SOURCE })
    public async remove(id: string): Promise<void> {
        const repository = this.getRepository();
        const flag = await repository.findOneBy({ id });

        if (!flag) {
            this.logger.warn({ id }, "Couldn't find feature flag.");
            return;
        }

        await this.dbLockService.acquireTransactionLock(this.getUpdateFeatureFlagLockId(flag.key));
        await repository.remove([flag]);
        await this.invalidateCache(flag.key);
        this.logger.debug({ id }, "Feature flag removed.");
    }

    private async invalidateCache(key: string): Promise<void> {
        await this.store.clear(key);
    }

    private getUpdateFeatureFlagLockId(key: string) {
        return `feature-flag-${key};`;
    }

    private getRepository(): Repository<FeatureFlagEntity> {
        return this.repository;
    }
}
