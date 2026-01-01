import { IntegrationEvent, IntegrationEvents } from "@/common/events";
import { DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentKind } from "@/modules/privacy/entities/ExportAttachmentManifest.entity";

export type DataExportBatchReadyEventPayload = {
    tenant: {
        id: string;
    };
    export: {
        id: string;
    };
    attachment: {
        key: string;
        path: string;
        scopes: DataExportScope[];
        kind: ExportAttachmentKind;
        metadata: {
            checksum: string;
            part: number;
            nextPart: number | null;
        };
    };
};

export class DataExportBatchReadyEvent extends IntegrationEvent<DataExportBatchReadyEventPayload> {
    public constructor(tenantId: string, payload: DataExportBatchReadyEventPayload) {
        const topic = IntegrationEvents.export.batch.ready.topic;
        const subject = IntegrationEvents.export.batch.ready.subject;

        super({
            topic,
            subject,
            partitionKey: `${topic}_${tenantId}`,
            payload,
            tenantId,
        });
    }
}
