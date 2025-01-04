import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { AuthorDto } from "@/modules/journal/author/dto/Author.dto";
import { AuthorEntity } from "@/modules/journal/author/entities/Author.entity";
import { Author } from "@/modules/journal/author/models/Author.model";

export class AuthorMapper extends BaseModelDTOEntityMapper<Author, AuthorDto, AuthorEntity> {
    fromDtoToModel(dto: AuthorDto): Author {
        return { id: dto.id };
    }

    fromEntityToModel(entity: AuthorEntity): Author {
        return { id: entity.id };
    }

    fromModelToDto(model: Author): AuthorDto {
        return new AuthorDto({ id: model.id });
    }
}
