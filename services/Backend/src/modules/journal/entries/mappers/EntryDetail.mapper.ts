import { plainToInstance } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { EntryDetailDto } from "@/modules/journal/entries/dto/EntryDetail.dto";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { type IEntryDetailMapper } from "@/modules/journal/entries/mappers/IEntryDetail.mapper";
import { EntryDetail } from "@/modules/journal/entries/models/EntryDetail.model";

export class EntryDetailMapper extends BaseModelDTOEntityMapper<EntryDetail, EntryDetailDto, EntryEntity> implements IEntryDetailMapper {
    public fromEntityToModel(entity: EntryEntity): EntryDetail {
        return {
            id: entity.id,
            content: entity.content,
            isCompleted: entity.isCompleted,
            isFeatured: entity.isFeatured,
            daily: entity.daily.date,
            goals: entity.goals.map((goal) => goal.name),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    public fromModelToDto(model: EntryDetail): EntryDetailDto {
        return plainToInstance(EntryDetailDto, {
            id: model.id,
            content: model.content,
            isCompleted: model.isCompleted,
            isFeatured: model.isFeatured,
            daily: model.daily,
            goals: model.goals,
            createdAt: model.createdAt,
        });
    }
}
