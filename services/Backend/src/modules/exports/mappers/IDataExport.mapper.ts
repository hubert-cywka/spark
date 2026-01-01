import { type IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { DataExportDto } from "@/modules/exports/dto/DataExport.dto";
import { DataExportEntity } from "@/modules/exports/entities/DataExport.entity";
import { DataExport } from "@/modules/exports/models/DataExport.model";

export const DataExportMapperToken = Symbol("DataExportMapperToken");

export interface IDataExportMapper extends IModelDTOEntityMapper<DataExport, DataExportDto, DataExportEntity> {}
