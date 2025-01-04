import { IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { AuthorDto } from "@/modules/journal/author/dto/Author.dto";
import { AuthorEntity } from "@/modules/journal/author/entities/Author.entity";
import { Author } from "@/modules/journal/author/models/Author.model";

export const AuthorMapperToken = Symbol("AuthorMapper");

export interface IAuthorMapper extends IModelDTOEntityMapper<Author, AuthorDto, AuthorEntity> {}
