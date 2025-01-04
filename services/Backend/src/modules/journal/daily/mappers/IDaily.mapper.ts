import { IMapperWithPagination } from "@/common/mappers/IWithPagination.mapper";
import { DailyDto } from "@/modules/journal/daily/dto/Daily.dto";
import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { Daily } from "@/modules/journal/daily/models/Daily.model";

export const DailyMapperToken = Symbol("DailyMapper");

export interface IDailyMapper extends IMapperWithPagination<Daily, DailyDto, DailyEntity> {}
