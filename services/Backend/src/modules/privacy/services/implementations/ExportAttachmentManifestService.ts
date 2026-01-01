import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { type ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";
import { ExportAttachmentKind, ExportAttachmentManifestEntity } from "@/modules/privacy/entities/ExportAttachmentManifest.entity";
import { PRIVACY_MODULE_DATA_SOURCE } from "@/modules/privacy/infrastructure/database/constants";
import {
    type IExportAttachmentManifestMapper,
    ExportAttachmentManifestMapperToken,
} from "@/modules/privacy/mappers/IExportAttachmentManifest.mapper";
import { type IExportAttachmentManifestService } from "@/modules/privacy/services/interfaces/IExportAttachmentManifestService";

@Injectable()
export class ExportAttachmentManifestService implements IExportAttachmentManifestService {
    public constructor(
        @InjectRepository(ExportAttachmentManifestEntity, PRIVACY_MODULE_DATA_SOURCE)
        private readonly repository: Repository<ExportAttachmentManifestEntity>,
        @Inject(ExportAttachmentManifestMapperToken)
        private readonly mapper: IExportAttachmentManifestMapper
    ) {}

    public async getTemporaryManifestsByExportId(exportId: string) {
        const dataExports = await this.getRepository().find({ where: { dataExportId: exportId, kind: ExportAttachmentKind.TEMPORARY } });
        return this.mapper.fromEntityToModelBulk(dataExports);
    }

    public async getFinalManifestByExportId(exportId: string) {
        const dataExport = await this.getRepository().findOne({ where: { dataExportId: exportId, kind: ExportAttachmentKind.FINAL } });

        if (!dataExport) {
            return null;
        }

        return this.mapper.fromEntityToModel(dataExport);
    }

    // It's possible that we will store some duplicate attachments, e.g., covering the same export scope. And we are
    // okay with it, it does not break anything, and the user can just discard the duplicate. It's also pretty rare.
    public async storeAttachmentManifest(exportId: string, attachment: ExportAttachmentManifest) {
        await this.getRepository().save({
            dataExport: {
                id: exportId,
            },
            kind: attachment.kind,
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
