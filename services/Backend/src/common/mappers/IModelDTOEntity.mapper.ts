import { PageDto } from "@/common/pagination/dto/Page.dto";
import { Paginated } from "@/common/pagination/types/Paginated";

export interface IModelDTOEntityMapper<TModel, TDto, TEntity> {
    fromDtoToModel(dto: TDto): TModel;
    fromModelToDto(model: TModel): TDto;
    fromEntityToModel(entity: TEntity): TModel;

    fromDtoToModelBulk(dto: TDto[]): TModel[];
    fromEntityToModelBulk(entities: TEntity[]): TModel[];
    fromModelToDtoBulk(models: TModel[]): TDto[];

    fromDtoToModelPaginated(dto: Paginated<TDto>): Paginated<TModel>;
    fromEntityToModelPaginated(entity: Paginated<TEntity>): Paginated<TModel>;
    fromModelToDtoPage(model: Paginated<TModel>): PageDto<TDto>;
}
