import { plainToClass } from "class-transformer";

import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { AuthorDto } from "@/modules/journal/authors/dto/Author.dto";
import { AuthorEntity } from "@/modules/journal/authors/entities/Author.entity";
import { Author } from "@/modules/journal/authors/models/Author.model";

export class AuthorMapper extends BaseModelDTOEntityMapper<Author, AuthorDto, AuthorEntity> {
    fromDtoToModel(dto: AuthorDto): Author {
        return { id: dto.id };
    }

    fromEntityToModel(entity: AuthorEntity): Author {
        return { id: entity.id };
    }

    fromModelToDto(model: Author): AuthorDto {
        return plainToClass(AuthorDto, { id: model.id });
    }
}
