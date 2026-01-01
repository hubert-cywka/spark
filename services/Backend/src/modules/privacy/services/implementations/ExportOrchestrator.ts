import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

import { type IDatabaseLockService, DatabaseLockServiceToken } from "@/common/database/services/IDatabaseLockService";
import { DataExportScope } from "@/common/export/models/DataExportScope";
import { type ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";
import { DataExportAttachmentPathBuilder } from "@/common/export/services/DataExportAttachmentPathBuilder";
import { type IObjectStorage, ObjectStorageToken } from "@/common/s3/services/IObjectStorage";
import { ExportAttachmentKind } from "@/modules/privacy/entities/ExportAttachmentManifest.entity";
import { PRIVACY_MODULE_DATA_SOURCE } from "@/modules/privacy/infrastructure/database/constants";
import {
    type IDataExportEventsPublisher,
    DataExportEventsPublisherToken,
} from "@/modules/privacy/services/interfaces/IDataExportEventsPublisher";
import { type IDataExportService, DataExportServiceToken } from "@/modules/privacy/services/interfaces/IDataExportService";
import {
    type IExportAttachmentManifestService,
    ExportAttachmentManifestServiceToken,
} from "@/modules/privacy/services/interfaces/IExportAttachmentManifestService";
import { type IExportOrchestrator } from "@/modules/privacy/services/interfaces/IExportOrchestrator";
import { type IExportScopeCalculator, ExportScopeCalculatorToken } from "@/modules/privacy/services/interfaces/IExportScopeCalculator";

// TODO: Remove orphaned or expired attachments.
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
        @Inject(ObjectStorageToken)
        private readonly objectStorage: IObjectStorage,
        @Inject(DatabaseLockServiceToken)
        private readonly dbLockService: IDatabaseLockService
    ) {}

    @Transactional({ connectionName: PRIVACY_MODULE_DATA_SOURCE })
    public async start(tenantId: string, scopes: DataExportScope[]) {
        const exportEntry = await this.dataExportService.createExportEntry(tenantId, scopes);
        await this.publisher.onExportStarted(tenantId, exportEntry.id, exportEntry.targetScopes);
    }

    @Transactional({ connectionName: PRIVACY_MODULE_DATA_SOURCE })
    public async cancel(tenantId: string, exportId: string) {
        await this.acquireLockForExportUpdate(exportId);
        await this.dataExportService.markExportAsCancelled(tenantId, exportId);
        await this.publisher.onExportCancelled(tenantId, exportId);
    }

    // 1. Acquire the lock, so no one else can update the export in the meantime (including attachments management).
    // 2. Check if the export is still active. If not, throw an error (it's implicit).
    // 3. Add an attachment.
    // 4. Check if the export can be completed. If not, finish early.
    // 5. Otherwise, we can finalize the export. Start by merging the attachments into a single one.
    //    - This operation needs to be idempotent. If the attachments were already merged, do not do anything.
    // 6. As soon as attachments are ready, mark the export as completed and enqueue an event.
    // 7. Once the enqueued event is processed, all old attachments will be removed.
    //    - We delay the cleanup, so we can finish this transaction faster. Concurrent updates of the export should
    //    be pretty rare, as checkpoints are sequential, and only cancellations can be concurrent (with the possibility
    //    of 1 simultaneous checkpoint too). Locking prevents any inconsistencies, but it creates contention.
    @Transactional({ connectionName: PRIVACY_MODULE_DATA_SOURCE })
    async checkpoint(tenantId: string, exportId: string, attachmentManifest: ExportAttachmentManifest) {
        await this.acquireLockForExportUpdate(exportId);
        const exportToCheckpoint = await this.dataExportService.getActiveById(tenantId, exportId);

        await this.checkpointAttachment(exportId, attachmentManifest);
        const manifests = await this.attachmentService.findTemporaryManifestsByExportId(tenantId, exportId);

        if (!this.isExportCompleted(exportToCheckpoint.targetScopes, manifests)) {
            this.logger.log({ exportId }, "Export checkpoint completed. Attachments still missing.");
            return;
        }

        await this.mergeAttachments(exportId, manifests);
        await this.dataExportService.markExportAsCompleted(tenantId, exportId);
        await this.publisher.onExportCompleted(tenantId, exportId);
        this.logger.log({ exportId }, "Export checkpoint completed. All attachments ready.");
    }

    @Transactional({ connectionName: PRIVACY_MODULE_DATA_SOURCE })
    public async cleanup(tenantId: string, exportId: string) {
        await this.acquireLockForExportUpdate(exportId);
        const manifests = await this.attachmentService.findTemporaryManifestsByExportId(tenantId, exportId);
        const paths = manifests.map((manifest) => manifest.path);

        await this.objectStorage.delete(paths);
        await this.attachmentService.deleteAttachmentManifests(manifests);
        this.logger.log({ exportId }, "Temporary export attachments cleaned up.");
    }

    private isExportCompleted(targetScopes: DataExportScope[], manifests: ExportAttachmentManifest[]) {
        const missingScopes = this.scopeCalculator.findMissingScopes(targetScopes, manifests);
        return !missingScopes.length;
    }

    private async mergeAttachments(exportId: string, manifests: ExportAttachmentManifest[]) {
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
            kind: ExportAttachmentKind.FINAL,
            metadata: {
                checksum,
                part: 1,
                nextPart: null,
            },
        };

        await this.checkpointAttachment(exportId, finalManifest);
    }

    private async checkpointAttachment(exportId: string, manifest: ExportAttachmentManifest) {
        await this.attachmentService.storeAttachmentManifest(exportId, manifest);
    }

    private async acquireLockForExportUpdate(exportId: string) {
        const lockId = `update-export-lock-${exportId}`;
        await this.dbLockService.acquireTransactionLock(lockId);
    }
}
