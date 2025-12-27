import { plainToInstance } from "class-transformer";

import { DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";
import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { DataExportScopeDto } from "@/modules/privacy/dto/DataExportScope.dto";
import { ExportAttachmentManifestDto } from "@/modules/privacy/dto/ExportAttachmentManifest.dto";
import { ExportAttachmentManifestEntity } from "@/modules/privacy/entities/ExportAttachmentManifest.entity";
import { type IExportAttachmentManifestMapper } from "@/modules/privacy/mappers/IExportAttachmentManifest.mapper";

export class ExportAttachmentManifestMapper
    extends BaseModelDTOEntityMapper<ExportAttachmentManifest, ExportAttachmentManifestDto, ExportAttachmentManifestEntity>
    implements IExportAttachmentManifestMapper
{
    fromEntityToModel = (entity: ExportAttachmentManifestEntity): ExportAttachmentManifest => {
        return {
            key: entity.key,
            path: entity.path,
            scope: this.unwrapScope(entity.scope),
            metadata: {
                part: entity.part,
                nextPart: entity.nextPart,
                checksum: entity.checksum,
            },
        };
    };

    fromModelToDto = (model: ExportAttachmentManifest): ExportAttachmentManifestDto => {
        return plainToInstance(ExportAttachmentManifestDto, {
            key: model.key,
            path: model.path,
            checksum: model.metadata.checksum,
            scope: this.unwrapScope(model.scope),
        } as ExportAttachmentManifestDto);
    };

    private unwrapScope(scope: DataExportScope | DataExportScopeDto) {
        return {
            domain: scope.domain,
            dateRange: {
                from: scope.dateRange.from,
                to: scope.dateRange.to,
            },
        };
    }
}
