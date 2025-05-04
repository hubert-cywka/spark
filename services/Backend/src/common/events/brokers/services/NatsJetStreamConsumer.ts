import { ConsumerMessages, jetstream, JetStreamClient, JetStreamManager } from "@nats-io/jetstream";
import { Injectable, Logger } from "@nestjs/common";
import { type NatsConnection } from "nats";

import { IntegrationEvent } from "@/common/events";
import { type IPubSubConsumer, OnEventReceivedHandler } from "@/common/events/services/interfaces/IPubSubConsumer";
import { IntegrationEventsConsumer } from "@/common/events/types";
import { logger } from "@/lib/logger";

@Injectable()
export class NatsJetStreamConsumer implements IPubSubConsumer {
    private readonly logger = new Logger(NatsJetStreamConsumer.name);
    private readonly jetStreamClient: JetStreamClient;
    private jetStreamManager: JetStreamManager | null = null;

    public constructor(connection: NatsConnection) {
        this.jetStreamClient = jetstream(connection);
    }

    public async listen(consumers: IntegrationEventsConsumer[], onEventReceived: OnEventReceivedHandler): Promise<void> {
        await this.registerConsumers(consumers);
        const streams = await this.getMessagesStreams(consumers);

        for await (const stream of streams) {
            void this.readMessagesStream(stream, onEventReceived);
        }
    }

    private async readMessagesStream(messages: ConsumerMessages, onEventReceived: OnEventReceivedHandler) {
        for await (const message of messages) {
            const event = IntegrationEvent.fromPlain(message.json());

            try {
                await onEventReceived(
                    event,
                    () => message.ack(),
                    () => message.nak()
                );
            } catch (error) {
                logger.log({ error }, "Couldn't receive event.");
                message.nak();
            }
        }
    }

    private async getMessagesStreams(consumers: IntegrationEventsConsumer[]) {
        const consumerMessagesList: Promise<ConsumerMessages>[] = [];

        for await (const consumer of consumers) {
            this.logger.log({ consumer }, "Reading consumer's message stream.");
            const registeredConsumer = await this.jetStreamClient.consumers.get(consumer.stream, consumer.name);

            if (registeredConsumer.isPullConsumer()) {
                const messages = registeredConsumer.consume();
                consumerMessagesList.push(messages);
            }
        }

        return consumerMessagesList;
    }

    private async registerConsumers(consumers: IntegrationEventsConsumer[]): Promise<void> {
        const streams = [...new Set(consumers.map((consumer) => consumer.stream))];
        const registeredConsumers = await this.getRegisteredConsumers(streams);

        for (const consumer of consumers) {
            const exists = !!registeredConsumers.find((registered) => registered.name === consumer.name);

            if (exists) {
                await this.updateConsumer(consumer);
                this.logger.log({ consumer }, "Consumer updated.");
            } else {
                await this.createConsumer(consumer);
                this.logger.log({ consumer }, "Consumer added.");
            }
        }
    }

    private async getRegisteredConsumers(streams: string[]): Promise<IntegrationEventsConsumer[]> {
        const existingConsumers: IntegrationEventsConsumer[] = [];
        const manager = await this.getManager();

        for (const stream of streams) {
            const streamConsumers = manager.consumers.list(stream);

            for await (const consumer of streamConsumers) {
                existingConsumers.push({
                    name: consumer.name,
                    stream: consumer.stream_name,
                    subjects: consumer.config.filter_subjects ?? [],
                });
            }
        }

        return existingConsumers;
    }

    private async createConsumer(consumer: IntegrationEventsConsumer): Promise<void> {
        const manager = await this.getManager();

        await manager.consumers.add(consumer.stream, {
            name: consumer.name,
            durable_name: consumer.name,
            filter_subjects: consumer.subjects,
            replay_policy: "instant",
            ack_policy: "all",
        });
    }

    private async updateConsumer(consumer: IntegrationEventsConsumer): Promise<void> {
        const manager = await this.getManager();

        await manager.consumers.update(consumer.stream, consumer.name, {
            filter_subjects: consumer.subjects,
        });
    }

    private async getManager(): Promise<JetStreamManager> {
        if (this.jetStreamManager) {
            return this.jetStreamManager;
        }

        const manager = await this.jetStreamClient.jetstreamManager();
        this.jetStreamManager = manager;
        return manager;
    }
}
