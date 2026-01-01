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
            kind: entity.kind,
            scopes: this.unwrapScopes(entity.scopes),
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
            scopes: this.unwrapScopes(model.scopes),
        } as ExportAttachmentManifestDto);
    };

    private unwrapScopes(scopes: DataExportScope[] | DataExportScopeDto[]) {
        return scopes.map((scope: DataExportScopeDto) => ({
            domain: scope.domain,
            dateRange: {
                from: scope.dateRange.from,
                to: scope.dateRange.to,
            },
        }));
    }
}
