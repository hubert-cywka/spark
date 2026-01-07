import { plainToInstance } from "class-transformer";

import { DataExportScope } from "@/common/export/models/DataExportScope";
import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { DataExportDto } from "@/modules/exports/dto/DataExport.dto";
import { DataExportScopeDto } from "@/modules/exports/dto/DataExportScope.dto";
import { DataExportEntity } from "@/modules/exports/entities/DataExport.entity";
import { type IDataExportMapper } from "@/modules/exports/mappers/IDataExport.mapper";
import { DataExport } from "@/modules/exports/models/DataExport.model";

export class DataExportMapper extends BaseModelDTOEntityMapper<DataExport, DataExportDto, DataExportEntity> implements IDataExportMapper {
    fromEntityToModel = (entity: DataExportEntity): DataExport => {
        return {
            id: entity.id,
            targetScopes: entity.targetScopes.map(this.unwrapScope),
            validUntil: entity.validUntil,
            startedAt: entity.startedAt,
            completedAt: entity.completedAt,
            cancelledAt: entity.cancelledAt,
        };
    };

    fromModelToDto = (model: DataExport): DataExportDto => {
        return plainToInstance(DataExportDto, {
            id: model.id,
            targetScopes: model.targetScopes.map(this.unwrapScope),
            validUntil: model.validUntil,
            startedAt: model.startedAt,
            completedAt: model.completedAt,
            cancelledAt: model.cancelledAt,
        } as DataExportDto);
    };

    private unwrapScope(scope: DataExportScope | DataExportScopeDto) {
        return {
            domain: scope.domain,
            dateRange: {
                from: new Date(scope.dateRange.from),
                to: new Date(scope.dateRange.to),
            },
        };
    }
}
