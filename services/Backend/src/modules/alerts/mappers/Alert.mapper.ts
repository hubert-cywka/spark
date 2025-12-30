import { plainToInstance } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { AlertDto } from "@/modules/alerts/dto/Alert.dto";
import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";
import { type IAlertMapper } from "@/modules/alerts/mappers/IAlert.mapper";
import { type Alert } from "@/modules/alerts/models/Alert.model";

export class AlertMapper extends BaseModelDTOEntityMapper<Alert, AlertDto, AlertEntity> implements IAlertMapper {
    fromEntityToModel(entity: AlertEntity): Alert {
        return {
            id: entity.id,
            time: entity.time,
            daysOfWeek: entity.daysOfWeek,
            enabled: entity.enabled,
            createdAt: entity.createdAt,
            nextTriggerAt: entity.nextTriggerAt,
            recipientId: entity.recipientId,
        };
    }

    fromModelToDto(model: Alert): AlertDto {
        return plainToInstance(AlertDto, {
            id: model.id,
            time: model.time,
            daysOfWeek: model.daysOfWeek,
            enabled: model.enabled,
            createdAt: model.createdAt.toISOString(),
            nextTriggerAt: model.nextTriggerAt?.toISOString() ?? null,
            recipientId: model.recipientId,
        });
    }
}
