import { plainToInstance } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { TwoFactorAuthenticationIntegrationDto } from "@/modules/identity/2fa/dto/TwoFactorAuthenticationIntegration.dto";
import { TwoFactorAuthenticationIntegrationEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationIntegration.entity";
import { type ITwoFactorAuthenticationIntegrationMapper } from "@/modules/identity/2fa/mappers/ITwoFactorAuthenticationIntegration.mapper";
import { type TwoFactorAuthenticationIntegration } from "@/modules/identity/2fa/models/TwoFactorAuthenticationIntegration.model";

export class TwoFactorAuthenticationIntegrationMapper
    extends BaseModelDTOEntityMapper<
        TwoFactorAuthenticationIntegration,
        TwoFactorAuthenticationIntegrationDto,
        TwoFactorAuthenticationIntegrationEntity
    >
    implements ITwoFactorAuthenticationIntegrationMapper
{
    public fromDtoToModel(dto: TwoFactorAuthenticationIntegrationDto): TwoFactorAuthenticationIntegration {
        return {
            id: dto.id,
            method: dto.method,
            secret: "",
            totpTTL: dto.totpTTL,
            enabledAt: dto.enabledAt ? new Date(dto.enabledAt) : null,
            createdAt: new Date(dto.createdAt),
            updatedAt: new Date(dto.updatedAt),
        };
    }

    public fromEntityToModel(entity: TwoFactorAuthenticationIntegrationEntity): TwoFactorAuthenticationIntegration {
        return {
            id: entity.id,
            method: entity.method,
            secret: entity.secret,
            totpTTL: entity.totpTTL,
            enabledAt: entity.enabledAt ? new Date(entity.enabledAt) : null,
            createdAt: new Date(entity.createdAt),
            updatedAt: new Date(entity.updatedAt),
        };
    }

    public fromModelToDto(model: TwoFactorAuthenticationIntegration): TwoFactorAuthenticationIntegrationDto {
        return plainToInstance(TwoFactorAuthenticationIntegrationDto, {
            id: model.id,
            method: model.method,
            totpTTL: model.totpTTL,
            enabledAt: model.enabledAt?.toISOString() ?? null,
            createdAt: model.updatedAt.toISOString(),
            updatedAt: model.updatedAt.toISOString(),
        });
    }
}
