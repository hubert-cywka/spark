import { plainToInstance } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { TenantDto } from "@/modules/configuration/dto/Tenant.dto";
import { TenantEntity } from "@/modules/configuration/entities/Tenant.entity";
import { type ITenantMapper } from "@/modules/configuration/mappers/ITenant.mapper";
import { Tenant } from "@/modules/configuration/models/Tenant.model";

export class TenantMapper extends BaseModelDTOEntityMapper<Tenant, TenantDto, TenantEntity> implements ITenantMapper {
    fromDtoToModel(dto: TenantDto): Tenant {
        return {
            id: dto.id,
        };
    }

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
