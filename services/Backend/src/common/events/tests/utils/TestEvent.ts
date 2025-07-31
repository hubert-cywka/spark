import { IntegrationEvent } from "@/common/events";
import { IntegrationEventTopic } from "@/common/events/types";

export class TestEvent extends IntegrationEvent {
    public constructor(topic: IntegrationEventTopic, subject: string, tenantId: string, createdAt?: Date) {
        super({
            payload: { tenantId },
            createdAt,
            topic,
            subject,
            tenantId,
            partitionKey: tenantId,
        });
    }
}
