import { Injectable, Logger } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";

import { type IEventPublisherService } from "./IEventPublisher.service";

import type { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

@Injectable()
export class EventPublisherService implements IEventPublisherService {
    private readonly logger = new Logger(EventPublisherService.name);

    public constructor(private client: ClientProxy) {}

    public publish(event: IntegrationEvent): void {
        const payload = event.getPayload();
        const topic = event.getTopic();

        this.logger.log({ topic, payload }, "Publishing event.");
        this.client.emit(topic, payload);
    }
}
