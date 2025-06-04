import { ConsumerMessages, jetstream, JetStreamClient, JetStreamManager } from "@nats-io/jetstream";
import { Injectable, Logger } from "@nestjs/common";
import { type NatsConnection } from "nats";

import { IntegrationEvent } from "@/common/events";
import { NatsConsumerMetadata } from "@/common/events/drivers/nats/types";
import { type IPubSubConsumer, OnEventsReceivedHandler } from "@/common/events/services/interfaces/IPubSubConsumer";

@Injectable()
export class NatsJetStreamConsumer implements IPubSubConsumer {
    private readonly logger = new Logger(NatsJetStreamConsumer.name);
    private readonly jetStreamClient: JetStreamClient;
    private jetStreamManager: JetStreamManager | null = null;

    public constructor(connection: NatsConnection) {
        this.jetStreamClient = jetstream(connection);
    }

    public async listen(topics: string[], onEventsReceived: OnEventsReceivedHandler): Promise<void> {
        // TODO: Implement
        const mockConsumers: NatsConsumerMetadata[] = [];

        await this.registerConsumers(mockConsumers);
        const streams = await this.getMessagesStreams(mockConsumers);

        for await (const stream of streams) {
            void this.readMessagesStream(stream, onEventsReceived);
        }
    }

    private async readMessagesStream(messages: ConsumerMessages, onEventsReceived: OnEventsReceivedHandler) {
        for await (const message of messages) {
            const event = IntegrationEvent.fromPlain(message.json());
            await onEventsReceived([event]);
            message.ack();
        }
    }

    private async getMessagesStreams(consumers: NatsConsumerMetadata[]) {
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

    private async registerConsumers(consumers: NatsConsumerMetadata[]): Promise<void> {
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

    private async getRegisteredConsumers(streams: string[]): Promise<NatsConsumerMetadata[]> {
        const existingConsumers: NatsConsumerMetadata[] = [];
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

    private async createConsumer(consumer: NatsConsumerMetadata): Promise<void> {
        const manager = await this.getManager();

        await manager.consumers.add(consumer.stream, {
            name: consumer.name,
            durable_name: consumer.name,
            filter_subjects: consumer.subjects,
            replay_policy: "instant",
            ack_policy: "all",
        });
    }

    private async updateConsumer(consumer: NatsConsumerMetadata): Promise<void> {
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
