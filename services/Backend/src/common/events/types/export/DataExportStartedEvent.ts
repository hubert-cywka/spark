import { IntegrationEvent, IntegrationEvents } from "@/common/events";
import { DataExportScope } from "@/common/export/models/DataExportScope";

export type DataExportStartedEventPayload = {
    tenant: {
        id: string;
    };
    export: {
        id: string;
        scopes: DataExportScope[];
    };
};

export class DataExportStartedEvent extends IntegrationEvent<DataExportStartedEventPayload> {
    public constructor(tenantId: string, payload: DataExportStartedEventPayload) {
        const topic = IntegrationEvents.export.started.topic;
        const subject = IntegrationEvents.export.started.subject;

        super({
            topic,
            subject,
            partitionKey: `${topic}_${tenantId}`,
            payload,
            tenantId,
        });
    }
}
