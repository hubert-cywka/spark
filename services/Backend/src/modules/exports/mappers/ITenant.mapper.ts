import { type IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { TenantDto } from "@/modules/exports/dto/Tenant.dto";
import { TenantEntity } from "@/modules/exports/entities/Tenant.entity";
import { Tenant } from "@/modules/exports/models/Tenant.model";

export const TenantMapperToken = Symbol("TenantMapper");

export interface ITenantMapper extends IModelDTOEntityMapper<Tenant, TenantDto, TenantEntity> {}
