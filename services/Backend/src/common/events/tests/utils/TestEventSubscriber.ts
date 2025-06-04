import { IntegrationEvent } from "@/common/events";
import { type IEventsQueueSubscriber } from "@/common/events/services/interfaces/IEventsQueueSubscriber";

export class TestEventEnqueueSubscriber implements IEventsQueueSubscriber {
    public notifyOnEnqueued(_event: IntegrationEvent) {}
}
