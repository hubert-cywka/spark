import { plainToClass } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { EntryDto } from "@/modules/journal/entries/dto/Entry.dto";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { IEntryMapper } from "@/modules/journal/entries/mappers/IEntry.mapper";
import { Entry } from "@/modules/journal/entries/models/Entry.model";

export class EntryMapper extends BaseModelDTOEntityMapper<Entry, EntryDto, EntryEntity> implements IEntryMapper {
    public fromDtoToModel(dto: EntryDto): Entry {
        return {
            id: dto.id,
            content: dto.content,
            isCompleted: dto.isCompleted,
            isFeatured: dto.isFeatured,
            dailyId: dto.dailyId,
            authorId: dto.authorId,
            createdAt: new Date(dto.createdAt),
            updatedAt: new Date(dto.updatedAt),
        };
    }

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
        };
    }

    public fromModelToDto(model: Entry): EntryDto {
        return plainToClass(EntryDto, {
            id: model.id,
            content: model.content,
            isCompleted: model.isCompleted,
            isFeatured: model.isFeatured,
            dailyId: model.dailyId,
            authorId: model.authorId,
            createdAt: model.createdAt.toISOString(),
            updatedAt: model.updatedAt.toISOString(),
        });
    }
}
