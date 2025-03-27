import { type IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { TenantDto } from "@/modules/gdpr/dto/Tenant.dto";
import { TenantEntity } from "@/modules/gdpr/entities/Tenant.entity";
import { Tenant } from "@/modules/gdpr/models/Tenant.model";

export const TenantMapperToken = Symbol("TenantMapper");

export interface ITenantMapper extends IModelDTOEntityMapper<Tenant, TenantDto, TenantEntity> {}
