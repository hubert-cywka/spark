import { type JetStreamClient, ConsumerMessages } from "@nats-io/jetstream";
import { Injectable, Logger } from "@nestjs/common";
import { PubAck, StringCodec } from "nats";
import { Observable } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

import { IntegrationEvent } from "@/common/events";
import { type IPubSubClient } from "@/common/events/services/interfaces/IPubSubClient";
import { EventConsumer } from "@/common/events/types";

@Injectable()
export class NatsJetStreamPubSubClient implements IPubSubClient {
    private readonly logger = new Logger(NatsJetStreamPubSubClient.name);

    public constructor(private readonly jetStreamClient: JetStreamClient) {}

    public publish(event: IntegrationEvent): Observable<PubAck> {
        const sc = StringCodec();
        return fromPromise(
            this.jetStreamClient.publish(event.getTopic(), sc.encode(JSON.stringify(event.toPlain())), { msgID: event.getId() })
        );
    }

    public async subscribe(consumers: EventConsumer[]): Promise<Promise<ConsumerMessages>[]> {
        const observables: Promise<ConsumerMessages>[] = [];
        const manager = await this.jetStreamClient.jetstreamManager();

        for (const consumer of consumers) {
            // TODO: Check if consumer already exists

            try {
                await manager.consumers.add(consumer.stream, {
                    name: consumer.name,
                    durable_name: consumer.name,
                    filter_subjects: consumer.subjects,
                    replay_policy: "instant",
                    ack_policy: "all",
                });

                this.logger.log({ consumer }, "Consumer configured.");
            } catch (error) {
                this.logger.log({ consumer, error }, "Consumer cannot be configured.");
            }
        }

        for await (const consumer of consumers) {
            this.logger.log({ consumer }, "Reading consumer's message stream.");
            const c = await this.jetStreamClient.consumers.get(consumer.stream, consumer.name);

            if (c.isPullConsumer()) {
                const messages = c.consume();
                observables.push(messages);
            }
        }

        return observables;
    }
}
