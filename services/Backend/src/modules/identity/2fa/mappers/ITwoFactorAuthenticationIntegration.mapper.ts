import { IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { TwoFactorAuthenticationIntegrationDto } from "@/modules/identity/2fa/dto/TwoFactorAuthenticationIntegration.dto";
import { TwoFactorAuthenticationIntegrationEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationIntegration.entity";
import { type TwoFactorAuthenticationIntegration } from "@/modules/identity/2fa/models/TwoFactorAuthenticationIntegration.model";

export const TwoFactorAuthenticationIntegrationMapperToken = Symbol("TwoFactorAuthenticationIntegrationMapper");

export interface ITwoFactorAuthenticationIntegrationMapper
    extends IModelDTOEntityMapper<
        TwoFactorAuthenticationIntegration,
        TwoFactorAuthenticationIntegrationDto,
        TwoFactorAuthenticationIntegrationEntity
    > {}
