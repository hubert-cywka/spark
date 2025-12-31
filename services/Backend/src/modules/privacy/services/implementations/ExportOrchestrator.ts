import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

import { DataExportScope } from "@/common/export/models/DataExportScope";
import { type ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";
import { formatToISODateString } from "@/common/utils/dateUtils";
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

// TODO: Complete 'completed' flow - e.g., aggregate attachments, send them to the user.
// TODO: Complete 'cancelled' flow - e.g., remove attachments, or ask other modules to remove them. No need to
//  cancel in-flight exports.
@Injectable()
export class ExportOrchestrator implements IExportOrchestrator {
    private readonly logger = new Logger(ExportOrchestrator.name);

    public constructor(
        @Inject(DataExportEventsPublisherToken)
        private readonly publisher: IDataExportEventsPublisher,
        @Inject(DataExportServiceToken)
        private readonly dataExportService: IDataExportService,
        @Inject(ExportAttachmentManifestServiceToken)
        private readonly exportAttachmentService: IExportAttachmentManifestService,
        @Inject(ExportScopeCalculatorToken)
        private readonly scopeCalculator: IExportScopeCalculator
    ) {}

    @Transactional({ connectionName: PRIVACY_MODULE_DATA_SOURCE })
    public async start(tenantId: string, scopes: DataExportScope[]) {
        const today = formatToISODateString(new Date());
        const mergedScopes = this.scopeCalculator.mergeScopes(scopes);
        const trimmedScopes = this.scopeCalculator.trimScopesAfter(mergedScopes, today);

        const exportEntry = await this.dataExportService.createExportEntry(tenantId, trimmedScopes);
        await this.publisher.onExportStarted(tenantId, exportEntry.id, trimmedScopes);
    }

    @Transactional({ connectionName: PRIVACY_MODULE_DATA_SOURCE })
    public async cancel(tenantId: string, exportId: string) {
        await this.dataExportService.markExportAsCancelled(tenantId, exportId);
        await this.publisher.onExportCancelled(tenantId, exportId);
    }

    @Transactional({ connectionName: PRIVACY_MODULE_DATA_SOURCE })
    async checkpoint(tenantId: string, exportId: string, attachmentManifest: ExportAttachmentManifest) {
        const exportToCheckpoint = await this.dataExportService.getActiveById(tenantId, exportId);

        await this.checkpointAttachment(exportId, attachmentManifest);
        const missingScopes = await this.findMissingScopes(exportId, exportToCheckpoint.targetScopes);
        const isExportCompleted = !missingScopes.length;

        if (!isExportCompleted) {
            this.logger.log({ exportId, missingScopes }, "Export checkpoint completed. Attachments still missing.");
            return;
        }

        await this.dataExportService.markExportAsCompleted(tenantId, exportId);
        await this.publisher.onExportCompleted(tenantId, exportId);
        this.logger.log({ exportId }, "Export checkpoint completed. All attachments ready.");
    }

    private async checkpointAttachment(exportId: string, attachmentManifest: ExportAttachmentManifest) {
        await this.exportAttachmentService.storeAttachmentManifest(exportId, attachmentManifest);
    }

    private async findMissingScopes(exportId: string, targetScopes: DataExportScope[]) {
        const manifests = await this.exportAttachmentService.getAllManifestsByExportId(exportId);
        return this.scopeCalculator.findMissingScopes(targetScopes, manifests);
    }
}
