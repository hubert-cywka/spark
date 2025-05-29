import { type DynamicModule, Module } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DatabaseModule } from "@/common/database/Database.module";
import { KafkaModule, KafkaModuleOptions } from "@/common/events/drivers/kafka/Kafka.module";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { EventInbox } from "@/common/events/services/implementations/EventInbox";
import { EventInboxProcessor, EventInboxProcessorOptions } from "@/common/events/services/implementations/EventInboxProcessor";
import { EventOutbox } from "@/common/events/services/implementations/EventOutbox";
import { EventOutboxProcessor, EventOutboxProcessorOptions } from "@/common/events/services/implementations/EventOutboxProcessor";
import { EventsRemovalService } from "@/common/events/services/implementations/EventsRemoval.service";
import { IntegrationEventsEncryptionService } from "@/common/events/services/implementations/IntegrationEventsEncryption.service";
import { IntegrationEventsJobsOrchestrator } from "@/common/events/services/implementations/IntegrationEventsJobsOrchestrator";
import { IntegrationEventsSubscriber } from "@/common/events/services/implementations/IntegrationEventsSubscriber";
import { EventInboxToken } from "@/common/events/services/interfaces/IEventInbox";
import { EventInboxProcessorToken } from "@/common/events/services/interfaces/IEventInboxProcessor";
import { EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { EventOutboxProcessorToken } from "@/common/events/services/interfaces/IEventOutboxProcessor";
import {
    InboxEventsRemovalServiceToken,
    OutboxEventsRemovalServiceToken,
} from "@/common/events/services/interfaces/IEventsRemoval.service";
import {
    IIntegrationEventsEncryptionService,
    IntegrationEventsEncryptionServiceToken,
} from "@/common/events/services/interfaces/IIntegrationEventsEncryption.service";
import { IntegrationEventsJobsOrchestratorToken } from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";
import { IntegrationEventsSubscriberToken } from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { getPubSubConsumerToken } from "@/common/events/services/interfaces/IPubSubConsumer";
import { getPubSubProducerToken, IPubSubProducer } from "@/common/events/services/interfaces/IPubSubProducer";
import { IntegrationEventsModuleOptions } from "@/common/events/types";
import { ExponentialRetryBackoffPolicy } from "@/common/retry/ExponentialRetryBackoffPolicy";
import { RetryBackoffPolicy } from "@/common/retry/RetryBackoffPolicy";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

const INBOX_RETRY_BACKOFF_POLICY_BASE_INTERVAL_IN_MS = 10_000;

const IntegrationEventsModuleOptionsToken = Symbol("IntegrationEventsModuleOptions");
const InboxRetryPolicyToken = Symbol("InboxRetryPolicy");

type IntegrationEventsModuleForFeatureOptions = {
    context: string;
    connectionName: string;
    inboxProcessorOptions?: Pick<EventInboxProcessorOptions, "maxAttempts" | "maxBatchSize">;
    outboxProcessorOptions?: Pick<EventOutboxProcessorOptions, "maxAttempts" | "maxBatchSize">;
};

@Module({})
export class IntegrationEventsModule {
    static forRootAsync(options: {
        useFactory: UseFactory<IntegrationEventsModuleOptions<KafkaModuleOptions>>;
        inject?: UseFactoryArgs;
        global?: boolean;
    }): DynamicModule {
        return {
            module: IntegrationEventsModule,
            providers: [
                {
                    provide: IntegrationEventsModuleOptionsToken,
                    useFactory: options.useFactory,
                    inject: options.inject ?? [],
                },
            ],
            exports: [IntegrationEventsModuleOptionsToken],
            global: options.global,
        };
    }

    static forFeature({
        context,
        connectionName,
        outboxProcessorOptions = {},
        inboxProcessorOptions = {},
    }: IntegrationEventsModuleForFeatureOptions): DynamicModule {
        const PubSubProducerToken = getPubSubProducerToken(context);
        const PubSubConsumerToken = getPubSubConsumerToken(context);

        return {
            module: IntegrationEventsModule,
            imports: [
                KafkaModule.forFeatureAsync(context, {
                    useFactory: (options: IntegrationEventsModuleOptions<KafkaModuleOptions>) => ({
                        groupId: `${context}-consumer-group`,
                        brokers: options.brokers,
                        clientId: options.clientId,
                    }),
                    inject: [IntegrationEventsModuleOptionsToken],
                }),
                DatabaseModule.forFeature(connectionName, [InboxEventEntity, OutboxEventEntity]),
            ],
            providers: [
                {
                    provide: InboxRetryPolicyToken,
                    useFactory: () => new ExponentialRetryBackoffPolicy(INBOX_RETRY_BACKOFF_POLICY_BASE_INTERVAL_IN_MS),
                },

                {
                    provide: InboxEventsRemovalServiceToken,
                    useFactory: (repository: Repository<InboxEventEntity>) => new EventsRemovalService(repository),
                    inject: [getRepositoryToken(InboxEventEntity, connectionName)],
                },

                {
                    provide: OutboxEventsRemovalServiceToken,
                    useFactory: (repository: Repository<OutboxEventEntity>) => new EventsRemovalService(repository),
                    inject: [getRepositoryToken(OutboxEventEntity, connectionName)],
                },

                {
                    provide: EventOutboxProcessorToken,
                    useFactory: (producer: IPubSubProducer, repository: Repository<OutboxEventEntity>) =>
                        new EventOutboxProcessor(producer, repository, {
                            context,
                            connectionName,
                            ...outboxProcessorOptions,
                        }),
                    inject: [PubSubProducerToken, getRepositoryToken(OutboxEventEntity, connectionName)],
                },

                {
                    provide: EventInboxProcessorToken,
                    useFactory: (
                        repository: Repository<InboxEventEntity>,
                        encryptionService: IIntegrationEventsEncryptionService,
                        retryPolicy: RetryBackoffPolicy
                    ) =>
                        new EventInboxProcessor(repository, encryptionService, {
                            context,
                            connectionName,
                            retryPolicy,
                            ...inboxProcessorOptions,
                        }),
                    inject: [
                        getRepositoryToken(InboxEventEntity, connectionName),
                        IntegrationEventsEncryptionServiceToken,
                        InboxRetryPolicyToken,
                    ],
                },

                {
                    provide: EventOutboxToken,
                    useFactory: (encryptionService: IIntegrationEventsEncryptionService, repository: Repository<OutboxEventEntity>) =>
                        new EventOutbox(
                            {
                                ...outboxProcessorOptions,
                                connectionName,
                                context,
                            },
                            repository,
                            encryptionService
                        ),
                    inject: [IntegrationEventsEncryptionServiceToken, getRepositoryToken(OutboxEventEntity, connectionName)],
                },

                {
                    provide: EventInboxToken,
                    useFactory: (repository: Repository<InboxEventEntity>) => new EventInbox({ connectionName, context }, repository),
                    inject: [getRepositoryToken(InboxEventEntity, connectionName)],
                },

                {
                    provide: IntegrationEventsSubscriberToken,
                    useFactory: ,
                },

                {
                    provide: IntegrationEventsJobsOrchestratorToken,
                    useClass: IntegrationEventsJobsOrchestrator,
                },
                {
                    provide: IntegrationEventsEncryptionServiceToken,
                    useClass: IntegrationEventsEncryptionService,
                },
            ],

            exports: [
                EventOutboxToken,
                EventInboxToken,
                IntegrationEventsSubscriberToken,
                IntegrationEventsJobsOrchestratorToken,
                InboxEventsRemovalServiceToken,
                OutboxEventsRemovalServiceToken,
            ],
        };
    }
}
