import { type JetStreamClient } from "@nats-io/jetstream";
import { Injectable } from "@nestjs/common";
import { classToPlain } from "class-transformer";
import { PubAck, StringCodec } from "nats";
import { Observable } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

import { IntegrationEvent } from "@/common/events";

export const PubSubClientToken = Symbol("PubSubClient");

export interface IPubSubClient {
    publish(event: IntegrationEvent): Observable<PubAck>;
}

@Injectable()
export class NatsJetStreamPubSubClient implements IPubSubClient {
    public constructor(private readonly jetStreamClient: JetStreamClient) {}

    public publish(event: IntegrationEvent): Observable<PubAck> {
        const sc = StringCodec();
        return fromPromise(
            this.jetStreamClient.publish(event.getTopic(), sc.encode(JSON.stringify(classToPlain(event))), { msgID: event.getId() })
        );
    }

    public async subscribe(topic: string) {}
}
