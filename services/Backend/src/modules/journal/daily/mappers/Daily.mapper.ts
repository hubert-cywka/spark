import { BaseMapperWithPagination } from "@/common/mappers/BaseWithPagination.mapper";
import { DailyDto } from "@/modules/journal/daily/dto/Daily.dto";
import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { IDailyMapper } from "@/modules/journal/daily/mappers/IDaily.mapper";
import { Daily } from "@/modules/journal/daily/models/Daily.model";

export class DailyMapper extends BaseMapperWithPagination<Daily, DailyDto, DailyEntity> implements IDailyMapper {
    public fromDtoToModel(dto: DailyDto): Daily {
        return {
            id: dto.id,
            date: dto.date,
            authorId: dto.authorId,
            createdAt: new Date(dto.createdAt),
            updatedAt: new Date(dto.updatedAt),
        };
    }

    public fromEntityToModel(entity: DailyEntity): Daily {
        return {
            id: entity.id,
            date: entity.date,
            authorId: entity.authorId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    public fromModelToDto(model: Daily): DailyDto {
        return {
            id: model.id,
            date: model.date,
            authorId: model.authorId,
            createdAt: model.createdAt.toISOString(),
            updatedAt: model.updatedAt.toISOString(),
        };
    }
}
