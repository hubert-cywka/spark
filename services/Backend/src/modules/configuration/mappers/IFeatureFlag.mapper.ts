import { type IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { FeatureFlagDto } from "@/modules/configuration/dto/FeatureFlag.dto";
import { FeatureFlagEntity } from "@/modules/configuration/entities/FeatureFlag.entity";
import { FeatureFlag } from "@/modules/configuration/models/FeatureFlag.model";

export const FeatureFlagMapperToken = Symbol("FeatureFlagMapper");

export interface IFeatureFlagMapper extends IModelDTOEntityMapper<FeatureFlag, FeatureFlagDto, FeatureFlagEntity> {}
