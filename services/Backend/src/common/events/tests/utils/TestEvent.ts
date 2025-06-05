import { IntegrationEvent } from "@/common/events";

export class TestEvent extends IntegrationEvent {
    public constructor(topic: string, tenantId: string, createdAt?: Date) {
        super({
            payload: { tenantId },
            createdAt,
            topic,
            tenantId,
            partitionKey: tenantId,
        });
    }
}
