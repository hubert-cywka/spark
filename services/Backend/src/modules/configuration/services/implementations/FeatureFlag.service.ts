import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { FeatureFlagEntity } from "@/modules/configuration/entities/FeatureFlag.entity";
import { CONFIGURATION_MODULE_DATA_SOURCE } from "@/modules/configuration/infrastructure/database/constants";
import { type IFeatureFlagMapper, FeatureFlagMapperToken } from "@/modules/configuration/mappers/IFeatureFlag.mapper";
import { type FeatureFlag } from "@/modules/configuration/models/FeatureFlag.model";
import { type FeatureFlagsFilter } from "@/modules/configuration/models/FeatureFlagFilters.model";
import { type IFeatureFlagService } from "@/modules/configuration/services/interfaces/IFeatureFlag.service";

@Injectable()
export class FeatureFlagService implements IFeatureFlagService {
    private readonly logger = new Logger(FeatureFlagService.name);

    public constructor(
        @InjectRepository(FeatureFlagEntity, CONFIGURATION_MODULE_DATA_SOURCE)
        private readonly repository: Repository<FeatureFlagEntity>,
        @Inject(FeatureFlagMapperToken)
        private readonly featureFlagMapper: IFeatureFlagMapper
    ) {}

    async get(flagsFilter: FeatureFlagsFilter): Promise<FeatureFlag[]> {
        const repository = this.getRepository();

        const flags = await repository.find({
            where: flagsFilter,
        });

        return this.featureFlagMapper.fromEntityToModelBulk(flags);
    }

    async set(tenantId: string, key: string, value: boolean): Promise<void> {
        const repository = this.getRepository();
        const conflictKeys = ["key", "tenantId"] as const satisfies (keyof FeatureFlagEntity)[];

        await repository.upsert(
            {
                tenantId: tenantId,
                key: key,
                value: value,
            },
            conflictKeys
        );

        this.logger.debug({ tenantId, key, value }, "Feature flag set.");
    }

    async remove(id: string): Promise<void> {
        const repository = this.getRepository();
        const result = await repository.delete({ id });

        if (result.affected === 0) {
            this.logger.warn({ id }, "Couldn't find feature flag.");
        } else {
            this.logger.debug({ id }, "Feature flag removed.");
        }
    }

    private getRepository(): Repository<FeatureFlagEntity> {
        return this.repository;
    }
}
