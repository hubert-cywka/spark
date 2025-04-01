import { IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { TwoFactorAuthenticationOptionDto } from "@/modules/identity/2fa/dto/TwoFactorAuthenticationOption.dto";
import { TwoFactorAuthenticationOptionEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationOption.entity";
import { TwoFactorAuthenticationOption } from "@/modules/identity/2fa/models/TwoFactorAuthenticationOption.model";

export const TwoFactorAuthenticationOptionMapperToken = Symbol("TwoFactorAuthenticationOptionMapper");

export interface ITwoFactorAuthenticationOptionMapper
    extends IModelDTOEntityMapper<TwoFactorAuthenticationOption, TwoFactorAuthenticationOptionDto, TwoFactorAuthenticationOptionEntity> {}
