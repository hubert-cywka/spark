import { jetstream, JetStreamClient } from "@nats-io/jetstream";
import { Injectable } from "@nestjs/common";
import { type NatsConnection, Codec, JSONCodec, PubAck } from "nats";
import { Observable } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

import { IntegrationEvent } from "@/common/events";
import { type IPubSubProducer } from "@/common/events/services/interfaces/IPubSubProducer";

@Injectable()
export class NatsJetStreamProducer implements IPubSubProducer {
    private readonly jetStreamClient: JetStreamClient;
    private readonly codec: Codec<unknown>;

    public constructor(connection: NatsConnection) {
        this.jetStreamClient = jetstream(connection);
        this.codec = JSONCodec();
    }

    public publish(event: IntegrationEvent): Observable<PubAck> {
        const metadata = { msgID: event.getId() };
        const message = this.codec.encode(event.toPlain());
        return fromPromise(this.jetStreamClient.publish(event.getTopic(), message, metadata));
    }
}
