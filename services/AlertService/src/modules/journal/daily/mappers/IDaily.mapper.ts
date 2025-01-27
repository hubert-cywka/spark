import { IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { DailyDto } from "@/modules/journal/daily/dto/Daily.dto";
import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { Daily } from "@/modules/journal/daily/models/Daily.model";

export const DailyMapperToken = Symbol("DailyMapper");

export interface IDailyMapper extends IModelDTOEntityMapper<Daily, DailyDto, DailyEntity> {}
