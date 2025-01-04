import { Paginated } from "@/common/pagination/types/Paginated";

export interface IModelDTOEntityMapper<TModel, TDto, TEntity> {
    fromDtoToModel(dto: TDto): TModel;
    fromModelToDto(model: TModel): TDto;
    fromEntityToModel(entity: TEntity): TModel;

    fromDtoToModelBulk(dto: TDto[]): TModel[];
    fromEntityToModelBulk(entities: TEntity[]): TModel[];
    fromModelToDtoBulk(models: TModel[]): TDto[];

    fromDtoToModelPaginated(dto: Paginated<TDto>): Paginated<TModel>;
    fromModelToDtoPaginated(model: Paginated<TModel>): Paginated<TDto>;
    fromEntityToModelPaginated(entity: Paginated<TEntity>): Paginated<TModel>;
}
