import { IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { EntryDto } from "@/modules/journal/entries/dto/Entry.dto";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { Entry } from "@/modules/journal/entries/models/Entry.model";

export const EntryMapperToken = Symbol("EntryMapper");

export interface IEntryMapper extends IModelDTOEntityMapper<Entry, EntryDto, EntryEntity> {}
