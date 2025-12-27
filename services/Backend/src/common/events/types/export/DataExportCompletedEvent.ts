import { IntegrationEvent, IntegrationEvents } from "@/common/events";

export type DataExportCompletedEventPayload = {
    tenant: {
        id: string;
    };
    export: {
        id: string;
    };
};

export class DataExportCompletedEvent extends IntegrationEvent<DataExportCompletedEventPayload> {
    public constructor(tenantId: string, payload: DataExportCompletedEventPayload) {
        const topic = IntegrationEvents.export.completed.topic;
        const subject = IntegrationEvents.export.completed.subject;

        super({
            topic,
            subject,
            partitionKey: `${topic}_${tenantId}`,
            payload,
            tenantId,
        });
    }
}
