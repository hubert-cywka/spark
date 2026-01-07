import { plainToInstance } from "class-transformer";

import { DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";
import { BaseModelDTOEntityMapper } from "@/common/mappers/BaseModelDTOEntity.mapper";
import { DataExportScopeDto } from "@/modules/exports/dto/DataExportScope.dto";
import { ExportAttachmentManifestDto } from "@/modules/exports/dto/ExportAttachmentManifest.dto";
import { ExportAttachmentManifestEntity } from "@/modules/exports/entities/ExportAttachmentManifest.entity";
import { type IExportAttachmentManifestMapper } from "@/modules/exports/mappers/IExportAttachmentManifest.mapper";

export class ExportAttachmentManifestMapper
    extends BaseModelDTOEntityMapper<ExportAttachmentManifest, ExportAttachmentManifestDto, ExportAttachmentManifestEntity>
    implements IExportAttachmentManifestMapper
{
    fromEntityToModel = (entity: ExportAttachmentManifestEntity): ExportAttachmentManifest => {
        return {
            key: entity.key,
            path: entity.path,
            stage: entity.stage,
            scopes: this.unwrapScopes(entity.scopes),
            metadata: {
                checksum: entity.checksum,
            },
        };
    };

    fromModelToDto = (model: ExportAttachmentManifest): ExportAttachmentManifestDto => {
        return plainToInstance(ExportAttachmentManifestDto, {
            key: model.key,
            path: model.path,
            checksum: model.metadata.checksum,
            scopes: this.unwrapScopes(model.scopes),
        } as ExportAttachmentManifestDto);
    };

    private unwrapScopes(scopes: DataExportScope[] | DataExportScopeDto[]) {
        return scopes.map((scope) => ({
            domain: scope.domain,
            dateRange: {
                from: scope.dateRange.from,
                to: scope.dateRange.to,
            },
        }));
    }
}
