import { IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { EntryDetailDto } from "@/modules/journal/entries/dto/EntryDetail.dto";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { EntryDetail } from "@/modules/journal/entries/models/EntryDetail.model";

export const EntryDetailMapperToken = Symbol("EntryDetailMapper");

export interface IEntryDetailMapper extends IModelDTOEntityMapper<EntryDetail, EntryDetailDto, EntryEntity> {}
