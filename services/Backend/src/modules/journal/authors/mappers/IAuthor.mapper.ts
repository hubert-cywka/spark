import { IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { AuthorDto } from "@/modules/journal/authors/dto/Author.dto";
import { AuthorEntity } from "@/modules/journal/authors/entities/Author.entity";
import { Author } from "@/modules/journal/authors/models/Author.model";

export const AuthorMapperToken = Symbol("AuthorMapper");

export interface IAuthorMapper extends IModelDTOEntityMapper<Author, AuthorDto, AuthorEntity> {}
