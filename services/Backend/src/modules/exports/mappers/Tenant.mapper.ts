import { plainToInstance } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { TenantDto } from "@/modules/exports/dto/Tenant.dto";
import { TenantEntity } from "@/modules/exports/entities/Tenant.entity";
import { type ITenantMapper } from "@/modules/exports/mappers/ITenant.mapper";
import { Tenant } from "@/modules/exports/models/Tenant.model";

export class TenantMapper extends BaseModelDTOEntityMapper<Tenant, TenantDto, TenantEntity> implements ITenantMapper {
    fromEntityToModel(entity: TenantEntity): Tenant {
        return {
            id: entity.id,
        };
    }

    fromModelToDto(model: Tenant): TenantDto {
        return plainToInstance(TenantDto, {
            id: model.id,
        });
    }
}
