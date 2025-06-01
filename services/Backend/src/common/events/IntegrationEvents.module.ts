import { type DynamicModule, Module } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DatabaseModule } from "@/common/database/Database.module";
import { KafkaForFeatureOptions, KafkaModule, KafkaModuleOptions } from "@/common/events/drivers/kafka/Kafka.module";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";
import { EventInbox } from "@/common/events/services/implementations/EventInbox";
import { EventInboxProcessor, EventInboxProcessorOptions } from "@/common/events/services/implementations/EventInboxProcessor";
import { EventOutbox } from "@/common/events/services/implementations/EventOutbox";
import { EventOutboxProcessor, EventOutboxProcessorOptions } from "@/common/events/services/implementations/EventOutboxProcessor";
import { EventsRemovalService } from "@/common/events/services/implementations/EventsRemoval.service";
import { IntegrationEventsEncryptionService } from "@/common/events/services/implementations/IntegrationEventsEncryption.service";
import { IntegrationEventsJobsOrchestrator } from "@/common/events/services/implementations/IntegrationEventsJobsOrchestrator";
import { IntegrationEventsSubscriber } from "@/common/events/services/implementations/IntegrationEventsSubscriber";
import { PartitionAssigner } from "@/common/events/services/implementations/PartitionAssigner";
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
import { IPartitionAssigner, PartitionAssignerToken } from "@/common/events/services/interfaces/IPartitionAssigner";
import { IPubSubProducer, PubSubProducerToken } from "@/common/events/services/interfaces/IPubSubProducer";
import { IntegrationEventsModuleOptions } from "@/common/events/types";
import { ExponentialRetryBackoffPolicy } from "@/common/retry/ExponentialRetryBackoffPolicy";
import { RetryBackoffPolicy } from "@/common/retry/RetryBackoffPolicy";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

const INBOX_RETRY_BACKOFF_POLICY_BASE_INTERVAL_IN_MS = 10_000;

const IntegrationEventsModuleOptionsToken = Symbol("IntegrationEventsModuleOptions");
const InboxRetryPolicyToken = Symbol("InboxRetryPolicy");

type IntegrationEventsModuleForFeatureOptions = {
    context: string;
    consumerGroupId: string;
    connectionName: string;
    inboxProcessorOptions?: Pick<EventInboxProcessorOptions, "maxAttempts" | "maxBatchSize">;
    outboxProcessorOptions?: Pick<EventOutboxProcessorOptions, "maxAttempts" | "maxBatchSize">;
};

@Module({})
export class IntegrationEventsModule {
    static forRootAsync(options: {
        useFactory: UseFactory<IntegrationEventsModuleOptions<KafkaForFeatureOptions>>;
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
        consumerGroupId,
        connectionName,
        outboxProcessorOptions = {},
        inboxProcessorOptions = {},
    }: IntegrationEventsModuleForFeatureOptions): DynamicModule {
        return {
            module: IntegrationEventsModule,
            imports: [
                KafkaModule.forFeatureAsync(context, {
                    useFactory: (options: IntegrationEventsModuleOptions<KafkaModuleOptions>) => ({
                        groupId: consumerGroupId,
                        brokers: options.brokers,
                        clientId: options.clientId,
                    }),
                    inject: [IntegrationEventsModuleOptionsToken],
                }),
                DatabaseModule.forFeature(connectionName, [
                    InboxEventEntity,
                    InboxEventPartitionEntity,
                    OutboxEventEntity,
                    OutboxEventPartitionEntity,
                ]),
            ],
            providers: [
                {
                    provide: PartitionAssignerToken,
                    useClass: PartitionAssigner,
                },

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
                    useFactory: (
                        producer: IPubSubProducer,
                        assigner: IPartitionAssigner,
                        eventsRepository: Repository<OutboxEventEntity>,
                        partitionsRepository: Repository<OutboxEventPartitionEntity>
                    ) =>
                        new EventOutboxProcessor(producer, eventsRepository, partitionsRepository, assigner, {
                            context,
                            connectionName,
                            ...outboxProcessorOptions,
                        }),
                    inject: [
                        PubSubProducerToken,
                        PartitionAssignerToken,
                        getRepositoryToken(OutboxEventEntity, connectionName),
                        getRepositoryToken(OutboxEventPartitionEntity, connectionName),
                    ],
                },

                {
                    provide: EventInboxProcessorToken,
                    useFactory: (
                        eventRepository: Repository<InboxEventEntity>,
                        partitionRepository: Repository<InboxEventPartitionEntity>,
                        assigner: IPartitionAssigner,
                        encryptionService: IIntegrationEventsEncryptionService,
                        retryPolicy: RetryBackoffPolicy
                    ) =>
                        new EventInboxProcessor(eventRepository, partitionRepository, assigner, encryptionService, {
                            context,
                            connectionName,
                            retryPolicy,
                            ...inboxProcessorOptions,
                        }),
                    inject: [
                        getRepositoryToken(InboxEventEntity, connectionName),
                        getRepositoryToken(InboxEventPartitionEntity, connectionName),
                        PartitionAssignerToken,
                        IntegrationEventsEncryptionServiceToken,
                        InboxRetryPolicyToken,
                    ],
                },

                {
                    provide: EventOutboxToken,
                    useFactory: (
                        encryptionService: IIntegrationEventsEncryptionService,
                        assigner: IPartitionAssigner,
                        repository: Repository<OutboxEventEntity>
                    ) =>
                        new EventOutbox(
                            {
                                ...outboxProcessorOptions,
                                connectionName,
                                context,
                            },
                            repository,
                            assigner,
                            encryptionService
                        ),
                    inject: [
                        IntegrationEventsEncryptionServiceToken,
                        PartitionAssignerToken,
                        getRepositoryToken(OutboxEventEntity, connectionName),
                    ],
                },

                {
                    provide: EventInboxToken,
                    useFactory: (repository: Repository<InboxEventEntity>, assigner: IPartitionAssigner) =>
                        new EventInbox({ connectionName, context }, repository, assigner),
                    inject: [getRepositoryToken(InboxEventEntity, connectionName), PartitionAssignerToken],
                },

                {
                    provide: IntegrationEventsSubscriberToken,
                    useClass: IntegrationEventsSubscriber,
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
