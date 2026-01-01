import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { type ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";
import { ExportAttachmentStage } from "@/common/export/types/ExportAttachmentStage";
import { ExportAttachmentManifestEntity } from "@/modules/exports/entities/ExportAttachmentManifest.entity";
import { ExportManifestNotFoundError } from "@/modules/exports/errors/ExportManifestNotFound.error";
import { EXPORTS_MODULE_DATA_SOURCE } from "@/modules/exports/infrastructure/database/constants";
import {
    type IExportAttachmentManifestMapper,
    ExportAttachmentManifestMapperToken,
} from "@/modules/exports/mappers/IExportAttachmentManifest.mapper";
import { type IExportAttachmentManifestService } from "@/modules/exports/services/interfaces/IExportAttachmentManifestService";

@Injectable()
export class ExportAttachmentManifestService implements IExportAttachmentManifestService {
    private readonly logger = new Logger(ExportAttachmentManifestService.name);

    public constructor(
        @InjectRepository(ExportAttachmentManifestEntity, EXPORTS_MODULE_DATA_SOURCE)
        private readonly repository: Repository<ExportAttachmentManifestEntity>,
        @Inject(ExportAttachmentManifestMapperToken)
        private readonly mapper: IExportAttachmentManifestMapper
    ) {}

    public async findTemporaryManifestsByExportId(tenantId: string, exportId: string) {
        const dataExports = await this.getRepository().find({
            where: { tenantId, dataExportId: exportId, stage: ExportAttachmentStage.TEMPORARY },
        });
        return this.mapper.fromEntityToModelBulk(dataExports);
    }

    public async getFinalManifestByExportId(tenantId: string, exportId: string) {
        const dataExport = await this.getRepository().findOne({
            where: { tenantId, dataExportId: exportId, stage: ExportAttachmentStage.FINAL },
        });

        if (!dataExport) {
            this.logger.warn({ tenantId, exportId }, "Final export attachment manifest not found");
            throw new ExportManifestNotFoundError();
        }

        return this.mapper.fromEntityToModel(dataExport);
    }

    // It's possible that we will store some duplicate attachments, e.g., covering the same export scope. And we are
    // okay with it, it does not break anything, and the user can just discard the duplicate. It's also pretty rare.
    public async storeAttachmentManifest(tenantId: string, dataExportId: string, attachment: ExportAttachmentManifest) {
        await this.getRepository().save({
            dataExportId,
            tenantId,
            stage: attachment.stage,
            key: attachment.key,
            path: attachment.path,
            scopes: attachment.scopes,
            part: attachment.metadata.part,
            nextPart: attachment.metadata.nextPart,
            checksum: attachment.metadata.checksum,
        });
    }

    public async deleteAttachmentManifests(attachmentManifests: ExportAttachmentManifest[]) {
        const keys = attachmentManifests.map((manifest) => manifest.key);
        await this.getRepository().delete({ key: In(keys) });
    }

    private getRepository(): Repository<ExportAttachmentManifestEntity> {
        return this.repository;
    }
}
