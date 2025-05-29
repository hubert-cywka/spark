import { jetstream, JetStreamClient } from "@nats-io/jetstream";
import { Injectable } from "@nestjs/common";
import { type NatsConnection, Codec, JSONCodec } from "nats";

import { IntegrationEvent } from "@/common/events";
import { type IPubSubProducer } from "@/common/events/services/interfaces/IPubSubProducer";
import { PublishAck } from "@/common/events/types";

@Injectable()
export class NatsJetStreamProducer implements IPubSubProducer {
    private readonly jetStreamClient: JetStreamClient;
    private readonly codec: Codec<unknown>;

    public constructor(connection: NatsConnection) {
        this.jetStreamClient = jetstream(connection);
        this.codec = JSONCodec();
    }

    public publish(event: IntegrationEvent): Promise<PublishAck> {
        const metadata = { msgID: event.getId() };
        const message = this.codec.encode(event.toPlain());

        const publishPromise = this.jetStreamClient.publish(event.getTopic(), message, metadata);

        return new Promise((resolve, reject) => {
            publishPromise.then(() => resolve({ ack: true })).catch(reject);
        });
    }
}
