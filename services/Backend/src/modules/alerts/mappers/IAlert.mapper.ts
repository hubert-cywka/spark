import { type IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { AlertDto } from "@/modules/alerts/dto/Alert.dto";
import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";
import { Alert } from "@/modules/alerts/models/Alert.model";

export const AlertMapperToken = Symbol("AlertMapper");

export interface IAlertMapper extends IModelDTOEntityMapper<Alert, AlertDto, AlertEntity> {}
