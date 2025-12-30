import { IntegrationEvent, IntegrationEvents } from "@/common/events";

export type DataExportCancelledEventPayload = {
    tenant: {
        id: string;
    };
    export: {
        id: string;
    };
};

export class DataExportCancelledEvent extends IntegrationEvent<DataExportCancelledEventPayload> {
    public constructor(tenantId: string, payload: DataExportCancelledEventPayload) {
        const topic = IntegrationEvents.export.cancelled.topic;
        const subject = IntegrationEvents.export.cancelled.subject;

        super({
            topic,
            subject,
            partitionKey: `${topic}_${tenantId}`,
            payload,
            tenantId,
        });
    }
}
