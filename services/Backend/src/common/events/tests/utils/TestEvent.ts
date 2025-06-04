import { IntegrationEvent } from "@/common/events";

export class TestEvent extends IntegrationEvent {
    public constructor(topic: string, tenantId: string) {
        super({
            payload: { tenantId },
            topic,
            tenantId,
            partitionKey: tenantId,
        });
    }
}
