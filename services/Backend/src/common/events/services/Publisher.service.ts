import { Injectable, Logger } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";

import { type IPublisherService } from "./IPublisher.service";

import type { DomainEvent } from "@/common/events/types/DomainEvent";

@Injectable()
export class PublisherService implements IPublisherService {
    private readonly logger = new Logger(PublisherService.name);

    public constructor(private client: ClientProxy) {}

    public publish(event: DomainEvent): void {
        const payload = event.getPayload();
        const topic = event.getTopic();

        this.logger.log({ topic, payload }, "Publishing event.");
        this.client.emit(topic, payload);
    }
}
