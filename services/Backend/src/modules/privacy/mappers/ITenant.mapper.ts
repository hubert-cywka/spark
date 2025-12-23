import { type IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { TenantDto } from "@/modules/privacy/dto/Tenant.dto";
import { TenantEntity } from "@/modules/privacy/entities/Tenant.entity";
import { Tenant } from "@/modules/privacy/models/Tenant.model";

export const TenantMapperToken = Symbol("TenantMapper");

export interface ITenantMapper extends IModelDTOEntityMapper<Tenant, TenantDto, TenantEntity> {}
