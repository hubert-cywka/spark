import { plainToClass } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { EntryDetailDto } from "@/modules/journal/entries/dto/EntryDetail.dto";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { type IEntryDetailMapper } from "@/modules/journal/entries/mappers/IEntryDetail.mapper";
import { EntryDetail } from "@/modules/journal/entries/models/EntryDetail.model";

export class EntryDetailMapper extends BaseModelDTOEntityMapper<EntryDetail, EntryDetailDto, EntryEntity> implements IEntryDetailMapper {
    public fromDtoToModel(dto: EntryDetailDto): EntryDetail {
        return {
            id: dto.id,
            content: dto.content,
            isCompleted: dto.isCompleted,
            isFeatured: dto.isFeatured,
            daily: dto.daily,
            goals: dto.goals,
        };
    }

    public fromEntityToModel(entity: EntryEntity): EntryDetail {
        return {
            id: entity.id,
            content: entity.content,
            isCompleted: entity.isCompleted,
            isFeatured: entity.isFeatured,
            daily: entity.daily.date,
            goals: entity.goals.map((goal) => goal.name),
        };
    }

    public fromModelToDto(model: EntryDetail): EntryDetailDto {
        return plainToClass(EntryDetailDto, {
            id: model.id,
            content: model.content,
            isCompleted: model.isCompleted,
            isFeatured: model.isFeatured,
            daily: model.daily,
            goals: model.goals,
        });
    }
}
