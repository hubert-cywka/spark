import { plainToClass } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { TwoFactorAuthenticationOptionDto } from "@/modules/identity/2fa/dto/TwoFactorAuthenticationOption.dto";
import { TwoFactorAuthenticationOptionEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationOption.entity";
import { type ITwoFactorAuthenticationOptionMapper } from "@/modules/identity/2fa/mappers/ITwoFactorAuthenticationOption.mapper";
import { TwoFactorAuthenticationOption } from "@/modules/identity/2fa/models/TwoFactorAuthenticationOption.model";

export class TwoFactorAuthenticationOptionMapper
    extends BaseModelDTOEntityMapper<TwoFactorAuthenticationOption, TwoFactorAuthenticationOptionDto, TwoFactorAuthenticationOptionEntity>
    implements ITwoFactorAuthenticationOptionMapper
{
    public fromDtoToModel(dto: TwoFactorAuthenticationOptionDto): TwoFactorAuthenticationOption {
        return {
            id: dto.id,
            method: dto.method,
            secret: "",
            enabledAt: dto.enabledAt ? new Date(dto.enabledAt) : null,
            createdAt: new Date(dto.createdAt),
            updatedAt: new Date(dto.updatedAt),
        };
    }

    public fromEntityToModel(entity: TwoFactorAuthenticationOptionEntity): TwoFactorAuthenticationOption {
        return {
            id: entity.id,
            method: entity.method,
            secret: entity.secret,
            enabledAt: entity.enabledAt ? new Date(entity.enabledAt) : null,
            createdAt: new Date(entity.createdAt),
            updatedAt: new Date(entity.updatedAt),
        };
    }

    public fromModelToDto(model: TwoFactorAuthenticationOption): TwoFactorAuthenticationOptionDto {
        return plainToClass(TwoFactorAuthenticationOptionDto, {
            id: model.id,
            method: model.method,
            enabledAt: model.enabledAt?.toISOString() ?? null,
            createdAt: model.updatedAt.toISOString(),
            updatedAt: model.updatedAt.toISOString(),
        });
    }
}
