import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";
import { type IModelDTOEntityMapper } from "@/common/mappers/IModelDTOEntity.mapper";
import { ExportAttachmentManifestDto } from "@/modules/exports/dto/ExportAttachmentManifest.dto";
import { ExportAttachmentManifestEntity } from "@/modules/exports/entities/ExportAttachmentManifest.entity";

export const ExportAttachmentManifestMapperToken = Symbol("ExportAttachmentManifestMapperToken");

export interface IExportAttachmentManifestMapper
    extends IModelDTOEntityMapper<ExportAttachmentManifest, ExportAttachmentManifestDto, ExportAttachmentManifestEntity> {}
