import { plainToInstance } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { FeatureFlagDto } from "@/modules/configuration/dto/FeatureFlag.dto";
import { FeatureFlagEntity } from "@/modules/configuration/entities/FeatureFlag.entity";
import { type IFeatureFlagMapper } from "@/modules/configuration/mappers/IFeatureFlag.mapper";
import { FeatureFlag } from "@/modules/configuration/models/FeatureFlag.model";

export class FeatureFlagMapper
    extends BaseModelDTOEntityMapper<FeatureFlag, FeatureFlagDto, FeatureFlagEntity>
    implements IFeatureFlagMapper
{
    fromDtoToModel(dto: FeatureFlagDto): FeatureFlag {
        return {
            id: dto.id,
            key: dto.key,
            value: dto.value,
            tenantId: dto.tenantId,
        };
    }

    fromEntityToModel(entity: FeatureFlagEntity): FeatureFlag {
        return {
            id: entity.id,
            key: entity.key,
            value: entity.value,
            tenantId: entity.tenantId,
        };
    }

    fromModelToDto(model: FeatureFlag): FeatureFlagDto {
        return plainToInstance(FeatureFlagDto, {
            id: model.id,
            key: model.key,
            value: model.value,
            tenantId: model.tenantId,
        });
    }
}
