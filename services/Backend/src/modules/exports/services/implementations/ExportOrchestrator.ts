import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

import { type IDatabaseLockService, DatabaseLockServiceToken } from "@/common/database/services/IDatabaseLockService";
import { getObjectStorageToken } from "@/common/objectStorage/services/IObjectStorage";
import { type IObjectStorage } from "@/common/objectStorage/services/IObjectStorage";
import { EXPORTS_MODULE_DATA_SOURCE } from "@/modules/exports/infrastructure/database/constants";
import {
    type IDataExportEventsPublisher,
    DataExportEventsPublisherToken,
} from "@/modules/exports/services/interfaces/IDataExportEventsPublisher";
import { type IDataExportService, DataExportServiceToken } from "@/modules/exports/services/interfaces/IDataExportService";
import {
    type IExportAttachmentManifestService,
    ExportAttachmentManifestServiceToken,
} from "@/modules/exports/services/interfaces/IExportAttachmentManifestService";
import { type IExportOrchestrator } from "@/modules/exports/services/interfaces/IExportOrchestrator";
import { type IExportScopeCalculator, ExportScopeCalculatorToken } from "@/modules/exports/services/interfaces/IExportScopeCalculator";
import { EXPORTS_OBJECT_STORAGE_KEY } from "@/modules/exports/shared/constants/objectStorage";
import { DataExportScope } from "@/modules/exports/shared/models/DataExportScope";
import { type ExportAttachmentManifest } from "@/modules/exports/shared/models/ExportAttachment.model";
import { DataExportAttachmentPathBuilder } from "@/modules/exports/shared/services/DataExportAttachmentPathBuilder";
import { ExportAttachmentStage } from "@/modules/exports/shared/types/ExportAttachmentStage";

// We don't delete old attachments or manifests because they have (rather short) TTL anyway
@Injectable()
export class ExportOrchestrator implements IExportOrchestrator {
    private readonly logger = new Logger(ExportOrchestrator.name);

    public constructor(
        @Inject(DataExportEventsPublisherToken)
        private readonly publisher: IDataExportEventsPublisher,
        @Inject(DataExportServiceToken)
        private readonly dataExportService: IDataExportService,
        @Inject(ExportAttachmentManifestServiceToken)
        private readonly attachmentService: IExportAttachmentManifestService,
        @Inject(ExportScopeCalculatorToken)
        private readonly scopeCalculator: IExportScopeCalculator,
        @Inject(getObjectStorageToken(EXPORTS_OBJECT_STORAGE_KEY))
        private readonly objectStorage: IObjectStorage,
        @Inject(DatabaseLockServiceToken)
        private readonly dbLockService: IDatabaseLockService
    ) {}

    @Transactional({ connectionName: EXPORTS_MODULE_DATA_SOURCE })
    public async start(tenantId: string, scopes: DataExportScope[]) {
        const exportEntry = await this.dataExportService.createExportEntry(tenantId, scopes);
        await this.publisher.onExportStarted(tenantId, exportEntry.id, exportEntry.targetScopes);
    }

    @Transactional({ connectionName: EXPORTS_MODULE_DATA_SOURCE })
    public async cancel(tenantId: string, exportId: string) {
        await this.acquireLockForExportUpdate(exportId);
        await this.dataExportService.markExportAsCancelled(tenantId, exportId);
        await this.publisher.onExportCancelled(tenantId, exportId);
    }

    @Transactional({ connectionName: EXPORTS_MODULE_DATA_SOURCE })
    async checkpoint(tenantId: string, exportId: string, attachmentManifest: ExportAttachmentManifest) {
        await this.acquireLockForExportUpdate(exportId);
        const exportToCheckpoint = await this.dataExportService.getActiveById(tenantId, exportId);

        await this.checkpointAttachment(tenantId, exportId, attachmentManifest);
        const manifests = await this.attachmentService.findManifestsByExportId(tenantId, exportId, ExportAttachmentStage.TEMPORARY);

        if (!this.isExportCompleted(exportToCheckpoint.targetScopes, manifests)) {
            this.logger.log({ exportId }, "Export checkpoint completed. Attachments still missing.");
            return;
        }

        await this.mergeAttachments(tenantId, exportId, manifests);
        await this.dataExportService.markExportAsCompleted(tenantId, exportId);
        await this.publisher.onExportCompleted(tenantId, exportId);
        this.logger.log({ exportId }, "Export checkpoint completed. All attachments ready.");
    }

    private isExportCompleted(targetScopes: DataExportScope[], manifests: ExportAttachmentManifest[]) {
        const missingScopes = this.scopeCalculator.findMissingScopes(targetScopes, manifests);
        return !missingScopes.length;
    }

    private async mergeAttachments(tenantId: string, exportId: string, manifests: ExportAttachmentManifest[]) {
        const attachmentsToMergePathPrefix = DataExportAttachmentPathBuilder.forExport(exportId).build();
        const finalAttachmentPath = DataExportAttachmentPathBuilder.forExport(exportId).setFilename("final.zip").build();

        const exists = await this.objectStorage.exists(finalAttachmentPath);
        if (exists) {
            this.logger.warn({ exportId, path: finalAttachmentPath }, "File already exists, won't merge attachments.");
            return;
        }

        const { checksum } = await this.objectStorage.zipToStorage(attachmentsToMergePathPrefix, finalAttachmentPath);
        const scopes = manifests.flatMap((manifest) => manifest.scopes);
        const mergedScopes = this.scopeCalculator.mergeScopes(scopes);

        const finalManifest = {
            key: `${exportId}-merged`,
            path: finalAttachmentPath,
            scopes: mergedScopes,
            stage: ExportAttachmentStage.FINAL,
            metadata: { checksum },
        };

        await this.checkpointAttachment(tenantId, exportId, finalManifest);
    }

    private async checkpointAttachment(tenantId: string, exportId: string, manifest: ExportAttachmentManifest) {
        await this.attachmentService.storeAttachmentManifest(tenantId, exportId, manifest);
    }

    private async acquireLockForExportUpdate(exportId: string) {
        const lockId = `update-export-lock-${exportId}`;
        await this.dbLockService.acquireTransactionLock(lockId);
    }
}
