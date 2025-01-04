import { Paginated } from "@/common/pagination/types/Paginated";

export interface IMapperWithPagination<TModel, TDto, TEntity> {
    fromDtoToModel(dto: TDto): TModel;
    fromModelToDto(model: TModel): TDto;
    fromEntityToModel(entity: TEntity): TModel;

    fromDtoToModelPaginated(dto: Paginated<TDto>): Paginated<TModel>;
    fromModelToDtoPaginated(model: Paginated<TModel>): Paginated<TDto>;
    fromEntityToModelPaginated(entity: Paginated<TEntity>): Paginated<TModel>;
}
