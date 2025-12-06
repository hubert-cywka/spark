import { type IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { TenantDto } from "@/modules/configuration/dto/Tenant.dto";
import { TenantEntity } from "@/modules/configuration/entities/Tenant.entity";
import { Tenant } from "@/modules/configuration/models/Tenant.model";

export const TenantMapperToken = Symbol("TenantMapper"); 

export interface ITenantMapper extends IModelDTOEntityMapper<Tenant, TenantDto, TenantEntity> {}
