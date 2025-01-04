import { IMapperWithPagination } from "@/common/mappers/IWithPagination.mapper";
import { Paginated } from "@/common/pagination/types/Paginated";

export abstract class BaseMapperWithPagination<TModel, TDto, TEntity> implements IMapperWithPagination<TModel, TDto, TEntity> {
    public abstract fromDtoToModel(dto: TDto): TModel;
    public abstract fromEntityToModel(entity: TEntity): TModel;
    public abstract fromModelToDto(model: TModel): TDto;

    public fromDtoToModelPaginated(dto: Paginated<TDto>): Paginated<TModel> {
        return {
            data: dto.data.map(this.fromDtoToModel),
            meta: dto.meta,
        };
    }

    public fromEntityToModelPaginated(entity: Paginated<TEntity>): Paginated<TModel> {
        return {
            data: entity.data.map(this.fromEntityToModel),
            meta: entity.meta,
        };
    }

    public fromModelToDtoPaginated(model: Paginated<TModel>): Paginated<TDto> {
        return {
            data: model.data.map(this.fromModelToDto),
            meta: model.meta,
        };
    }
}
