import { PageDto } from "@/common/pagination/dto/Page.dto";
import { Paginated } from "@/common/pagination/types/Paginated";

export interface IModelDTOEntityMapper<TModel, TDto, TEntity> {
    fromModelToDto(model: TModel): TDto;
    fromEntityToModel(entity: TEntity): TModel;

    fromEntityToModelBulk(entities: TEntity[]): TModel[];
    fromModelToDtoBulk(models: TModel[]): TDto[];

    fromEntityToModelPaginated(entity: Paginated<TEntity>): Paginated<TModel>;
    fromModelToDtoPage(model: Paginated<TModel>): PageDto<TDto>;
}
