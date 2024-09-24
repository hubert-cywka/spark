import { Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { PubSubEvent } from "../topics/PubSubEvent";
import { IPublisherService } from "./IPublisher.service";

@Injectable()
export class PublisherService implements IPublisherService {
    private readonly logger = new Logger();

    public constructor(private client: ClientProxy) {}

    public publish(event: PubSubEvent): void {
        const payload = event.getPayload();
        const topic = event.getTopic();

        this.logger.log({ topic, payload }, "Publishing event.");
        this.client.emit(topic, payload);
    }
}
