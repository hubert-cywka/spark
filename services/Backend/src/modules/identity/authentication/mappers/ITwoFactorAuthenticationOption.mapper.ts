import { IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { TwoFactorAuthenticationOptionDto } from "@/modules/identity/authentication/dto/outgoing/TwoFactorAuthenticationOption.dto";
import { TwoFactorAuthenticationOptionEntity } from "@/modules/identity/authentication/entities/TwoFactorAuthenticationOption.entity";
import { TwoFactorAuthenticationOption } from "@/modules/identity/authentication/models/TwoFactorAuthenticationOption.model";

export const TwoFactorAuthenticationOptionMapperToken = Symbol("TwoFactorAuthenticationOptionMapper");

export interface ITwoFactorAuthenticationOptionMapper
    extends IModelDTOEntityMapper<TwoFactorAuthenticationOption, TwoFactorAuthenticationOptionDto, TwoFactorAuthenticationOptionEntity> {}
