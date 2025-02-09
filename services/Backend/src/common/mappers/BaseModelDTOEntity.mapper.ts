import { IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { PageDto } from "@/common/pagination/dto/Page.dto";
import { PageMetaDto } from "@/common/pagination/dto/PageMeta.dto";
import { Paginated } from "@/common/pagination/types/Paginated";

export abstract class BaseModelDTOEntityMapper<TModel, TDto, TEntity> implements IModelDTOEntityMapper<TModel, TDto, TEntity> {
    public abstract fromDtoToModel(dto: TDto): TModel;
    public abstract fromEntityToModel(entity: TEntity): TModel;
    public abstract fromModelToDto(model: TModel): TDto;

    public fromDtoToModelBulk(dto: TDto[]): TModel[] {
        return dto.map(this.fromDtoToModel);
    }

    public fromEntityToModelBulk(entities: TEntity[]): TModel[] {
        return entities.map(this.fromEntityToModel);
    }

    public fromModelToDtoBulk(models: TModel[]): TDto[] {
        return models.map(this.fromModelToDto);
    }

    public fromDtoToModelPaginated(page: Paginated<TDto>): Paginated<TModel> {
        return this.mapPaginated(page, this.fromDtoToModel);
    }

    public fromEntityToModelPaginated(page: Paginated<TEntity>): Paginated<TModel> {
        return this.mapPaginated(page, this.fromEntityToModel);
    }

    public fromModelToDtoPage(page: Paginated<TModel>): PageDto<TDto> {
        const paginatedDto = this.mapPaginated(page, this.fromModelToDto);
        const metaDto = new PageMetaDto(paginatedDto.meta);
        return new PageDto(paginatedDto.data, metaDto);
    }

    private mapPaginated<TInput, TOutput>(page: Paginated<TInput>, mapFn: (item: TInput) => TOutput): Paginated<TOutput> {
        return {
            data: page.data.map(mapFn),
            meta: page.meta,
        };
    }
}
