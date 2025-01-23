import { plainToClass } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { AlertDto } from "@/modules/alerts/dto/Alert.dto";
import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";
import { type IAlertMapper } from "@/modules/alerts/mappers/IAlert.mapper";
import { type Alert } from "@/modules/alerts/models/Alert.model";

export class AlertMapper extends BaseModelDTOEntityMapper<Alert, AlertDto, AlertEntity> implements IAlertMapper {
    fromDtoToModel(dto: AlertDto): Alert {
        return {
            id: dto.id,
            time: dto.time,
            daysOfWeek: dto.daysOfWeek,
            enabled: dto.enabled,
            createdAt: new Date(dto.createdAt),
            lastTriggeredAt: dto.lastTriggeredAt ? new Date(dto.lastTriggeredAt) : null,
            recipientId: dto.recipientId,
        };
    }

    fromEntityToModel(entity: AlertEntity): Alert {
        return {
            id: entity.id,
            time: entity.time,
            daysOfWeek: entity.daysOfWeek,
            enabled: entity.enabled,
            createdAt: entity.createdAt,
            lastTriggeredAt: entity.lastTriggeredAt,
            recipientId: entity.recipientId,
        };
    }

    fromModelToDto(model: Alert): AlertDto {
        return plainToClass(AlertDto, {
            id: model.id,
            time: model.time,
            daysOfWeek: model.daysOfWeek,
            enabled: model.enabled,
            createdAt: model.createdAt.toISOString(),
            lastTriggeredAt: model.lastTriggeredAt?.toISOString() ?? null,
            recipientId: model.recipientId,
        });
    }
}
