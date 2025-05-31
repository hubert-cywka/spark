import { Injectable } from "@nestjs/common";
import { type Producer, CompressionTypes } from "kafkajs";

import { IntegrationEvent } from "@/common/events";
import { type IPubSubProducer } from "@/common/events/services/interfaces/IPubSubProducer";
import { PublishAck } from "@/common/events/types";

@Injectable()
export class KafkaProducer implements IPubSubProducer {
    private readonly compression: CompressionTypes;

    public constructor(private readonly producer: Producer) {
        this.compression = CompressionTypes.GZIP;
    }

    public publish(event: IntegrationEvent): Promise<PublishAck> {
        const message = {
            key: event.getTenantId(),
            value: event.toBuffer(),
        };

        const publishPromise = this.producer.send({
            compression: this.compression,
            topic: event.getTopic(),
            messages: [message],
        });

        return new Promise((resolve, reject) => {
            publishPromise.then(() => resolve({ ack: true })).catch(reject);
        });
    }
}
