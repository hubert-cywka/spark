import { Injectable } from "@nestjs/common";

import { type IEventPublisher, IntegrationEvent } from "@/common/events";
import { type IEventProducer } from "@/common/events/drivers/interfaces/IEventProducer";
import { type IEventOutbox } from "@/common/events/services/interfaces/IEventOutbox";
import { EventPublishOptions } from "@/common/events/services/interfaces/IEventPublisher";
import { type IIntegrationEventsEncryptionService } from "@/common/events/services/interfaces/IIntegrationEventsEncryption.service";

@Injectable()
export class EventPublisher implements IEventPublisher {
    public constructor(
        private readonly encryptionService: IIntegrationEventsEncryptionService,
        private readonly eventProducer: IEventProducer,
        private readonly outbox: IEventOutbox
    ) {}

    public async publish(event: IntegrationEvent, options?: EventPublishOptions): Promise<void> {
        const preparedEvent = await this.prepareEventToStore(event, options);
        await this.eventProducer.publish(preparedEvent);
    }

    public async publishMany(events: IntegrationEvent[], options?: EventPublishOptions): Promise<void> {
        const preparedEvents = await this.prepareEventsToStore(events, options);
        await this.eventProducer.publishBatch(preparedEvents);
    }

    public async enqueue(event: IntegrationEvent, options?: EventPublishOptions): Promise<void> {
        const preparedEvent = await this.prepareEventToStore(event, options);
        await this.outbox.enqueue(preparedEvent);
    }

    public async enqueueMany(events: IntegrationEvent[], options?: EventPublishOptions): Promise<void> {
        const preparedEvents = await this.prepareEventsToStore(events, options);
        await this.outbox.enqueueMany(preparedEvents);
    }

    private async prepareEventsToStore(events: IntegrationEvent[], options?: EventPublishOptions): Promise<IntegrationEvent[]> {
        const promises: Promise<IntegrationEvent>[] = [];

        for (const event of events) {
            promises.push(this.prepareEventToStore(event, options));
        }

        return await Promise.all(promises);
    }

    private async prepareEventToStore(event: IntegrationEvent, options?: EventPublishOptions): Promise<IntegrationEvent> {
        if (options?.encrypt) {
            return await this.encryptionService.encrypt(event.copy());
        }

        return event.copy();
    }
}
