import { plainToInstance } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { EntryDto } from "@/modules/journal/entries/dto/Entry.dto";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { IEntryMapper } from "@/modules/journal/entries/mappers/IEntry.mapper";
import { Entry } from "@/modules/journal/entries/models/Entry.model";

export class EntryMapper extends BaseModelDTOEntityMapper<Entry, EntryDto, EntryEntity> implements IEntryMapper {
    public fromEntityToModel(entity: EntryEntity): Entry {
        return {
            id: entity.id,
            content: entity.content,
            isCompleted: entity.isCompleted,
            isFeatured: entity.isFeatured,
            dailyId: entity.dailyId,
            authorId: entity.authorId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,

            daily: entity.daily?.date,
            goals: entity.goals?.map((goal) => goal.name),
        };
    }

    public fromModelToDto(model: Entry): EntryDto {
        return plainToInstance(EntryDto, {
            id: model.id,
            content: model.content,
            isCompleted: model.isCompleted,
            isFeatured: model.isFeatured,
            dailyId: model.dailyId,
            authorId: model.authorId,
            createdAt: model.createdAt.toISOString(),
            updatedAt: model.updatedAt.toISOString(),

            daily: model.daily,
            goals: model.goals,
        });
    }
}
