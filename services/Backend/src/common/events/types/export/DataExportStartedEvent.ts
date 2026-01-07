import { IntegrationEvent, IntegrationEvents } from "@/common/events";
import { DataExportScopeDomain } from "@/modules/exports/shared/types/DataExportScopeDomain";
import { DateStringRange } from "@/types/Date";

export type DataExportStartedEventPayload = {
    tenant: {
        id: string;
    };
    export: {
        id: string;
        scopes: {
            domain: DataExportScopeDomain;
            dateRange: DateStringRange;
        }[];
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
