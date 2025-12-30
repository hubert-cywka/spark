import { type IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { DataExportDto } from "@/modules/privacy/dto/DataExport.dto";
import { DataExportEntity } from "@/modules/privacy/entities/DataExport.entity";
import { DataExport } from "@/modules/privacy/models/DataExport.model";

export const DataExportMapperToken = Symbol("DataExportMapperToken");

export interface IDataExportMapper extends IModelDTOEntityMapper<DataExport, DataExportDto, DataExportEntity> {}
