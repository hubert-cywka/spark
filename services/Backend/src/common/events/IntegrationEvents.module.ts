import { type DynamicModule, Module } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DatabaseModule } from "@/common/database/Database.module";
import { KafkaForFeatureOptions, KafkaModule, KafkaModuleOptions } from "@/common/events/drivers/kafka/Kafka.module";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { InboxEventPartitionEntity } from "@/common/events/entities/InboxEventPartition.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { OutboxEventPartitionEntity } from "@/common/events/entities/OutboxEventPartition.entity";
import { InboxEventRepository } from "@/common/events/repositories/implementations/InboxEvent.repository";
import { InboxPartitionRepository } from "@/common/events/repositories/implementations/InboxPartition.repository";
import { OutboxEventRepository } from "@/common/events/repositories/implementations/OutboxEvent.repository";
import { OutboxPartitionRepository } from "@/common/events/repositories/implementations/OutboxPartition.repository";
import { type IInboxEventRepository, InboxEventRepositoryToken } from "@/common/events/repositories/interfaces/IInboxEvent.repository";
import {
    type IInboxPartitionRepository,
    InboxPartitionRepositoryToken,
} from "@/common/events/repositories/interfaces/IInboxPartition.repository";
import { IOutboxEventRepository, OutboxEventRepositoryToken } from "@/common/events/repositories/interfaces/IOutboxEvent.repository";
import {
    IOutboxPartitionRepository,
    OutboxPartitionRepositoryToken,
} from "@/common/events/repositories/interfaces/IOutboxPartition.repository";
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
    type IIntegrationEventsEncryptionService,
    IntegrationEventsEncryptionServiceToken,
} from "@/common/events/services/interfaces/IIntegrationEventsEncryption.service";
import { IntegrationEventsJobsOrchestratorToken } from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";
import { IntegrationEventsSubscriberToken } from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { type IPartitionAssigner, PartitionAssignerToken } from "@/common/events/services/interfaces/IPartitionAssigner";
import { type IPubSubProducer, PubSubProducerToken } from "@/common/events/services/interfaces/IPubSubProducer";
import { IntegrationEventsModuleOptions } from "@/common/events/types";
import { ExponentialRetryBackoffPolicy } from "@/common/retry/ExponentialRetryBackoffPolicy";
import { RetryBackoffPolicy } from "@/common/retry/RetryBackoffPolicy";
import { UseFactory, UseFactoryArgs } from "@/types/UseFactory";

const INBOX_RETRY_BACKOFF_POLICY_BASE_INTERVAL_IN_MS = 10_000;

const IntegrationEventsModuleOptionsToken = Symbol("IntegrationEventsModuleOptions");
const IntegrationEventsForFeatureOptionsToken = Symbol("IntegrationEventsForFeatureOptions");
const InboxRetryPolicyToken = Symbol("InboxRetryPolicy");

type IntegrationEventsModuleForFeatureDynamicOptions = {
    inboxProcessorOptions: Pick<EventInboxProcessorOptions, "maxAttempts" | "maxBatchSize">;
    outboxProcessorOptions: Pick<EventOutboxProcessorOptions, "maxAttempts" | "maxBatchSize">;
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

    static forFeatureAsync(options: {
        context: string;
        consumerGroupId: string;
        connectionName: string;
        useFactory: UseFactory<IntegrationEventsModuleForFeatureDynamicOptions>;
        inject?: UseFactoryArgs;
        global?: boolean;
    }): DynamicModule {
        return {
            module: IntegrationEventsModule,
            imports: [
                KafkaModule.forFeatureAsync(options.context, {
                    useFactory: (o: IntegrationEventsModuleOptions<KafkaModuleOptions>) => ({
                        groupId: options.consumerGroupId,
                        brokers: o.brokers,
                        clientId: o.clientId,
                    }),
                    inject: [IntegrationEventsModuleOptionsToken],
                }),
                DatabaseModule.forFeature(options.connectionName, [
                    InboxEventEntity,
                    InboxEventPartitionEntity,
                    OutboxEventEntity,
                    OutboxEventPartitionEntity,
                ]),
            ],
            providers: [
                {
                    provide: IntegrationEventsForFeatureOptionsToken,
                    useFactory: options.useFactory,
                    inject: options.inject ?? [],
                },

                {
                    provide: PartitionAssignerToken,
                    useClass: PartitionAssigner,
                },

                {
                    provide: InboxEventRepositoryToken,
                    useFactory: (repository: Repository<InboxEventEntity>) => new InboxEventRepository(repository),
                    inject: [getRepositoryToken(InboxEventEntity, options.connectionName)],
                },

                {
                    provide: InboxPartitionRepositoryToken,
                    useFactory: (repository: Repository<InboxEventPartitionEntity>) => new InboxPartitionRepository(repository),
                    inject: [getRepositoryToken(InboxEventPartitionEntity, options.connectionName)],
                },

                {
                    provide: OutboxEventRepositoryToken,
                    useFactory: (repository: Repository<OutboxEventEntity>) => new OutboxEventRepository(repository),
                    inject: [getRepositoryToken(OutboxEventEntity, options.connectionName)],
                },

                {
                    provide: OutboxPartitionRepositoryToken,
                    useFactory: (repository: Repository<OutboxEventPartitionEntity>) => new OutboxPartitionRepository(repository),
                    inject: [getRepositoryToken(OutboxEventPartitionEntity, options.connectionName)],
                },

                {
                    provide: InboxRetryPolicyToken,
                    useFactory: () => new ExponentialRetryBackoffPolicy(INBOX_RETRY_BACKOFF_POLICY_BASE_INTERVAL_IN_MS),
                },

                {
                    provide: InboxEventsRemovalServiceToken,
                    useFactory: (repository: Repository<InboxEventEntity>) => new EventsRemovalService(repository),
                    inject: [getRepositoryToken(InboxEventEntity, options.connectionName)],
                },

                {
                    provide: OutboxEventsRemovalServiceToken,
                    useFactory: (repository: Repository<OutboxEventEntity>) => new EventsRemovalService(repository),
                    inject: [getRepositoryToken(OutboxEventEntity, options.connectionName)],
                },

                {
                    provide: EventOutboxProcessorToken,
                    useFactory: (
                        eventRepository: IOutboxEventRepository,
                        partitionRepository: IOutboxPartitionRepository,
                        producer: IPubSubProducer,
                        assigner: IPartitionAssigner,
                        { outboxProcessorOptions }: IntegrationEventsModuleForFeatureDynamicOptions
                    ) =>
                        new EventOutboxProcessor(producer, eventRepository, partitionRepository, assigner, {
                            context: options.context,
                            connectionName: options.connectionName,
                            ...outboxProcessorOptions,
                        }),
                    inject: [
                        OutboxEventRepositoryToken,
                        OutboxPartitionRepositoryToken,
                        PubSubProducerToken,
                        PartitionAssignerToken,
                        IntegrationEventsForFeatureOptionsToken,
                    ],
                },

                {
                    provide: EventInboxProcessorToken,
                    useFactory: (
                        eventRepository: IInboxEventRepository,
                        partitionRepository: IInboxPartitionRepository,
                        assigner: IPartitionAssigner,
                        encryptionService: IIntegrationEventsEncryptionService,
                        retryPolicy: RetryBackoffPolicy,
                        { inboxProcessorOptions }: IntegrationEventsModuleForFeatureDynamicOptions
                    ) =>
                        new EventInboxProcessor(eventRepository, partitionRepository, assigner, encryptionService, {
                            context: options.context,
                            connectionName: options.connectionName,
                            retryPolicy,
                            ...inboxProcessorOptions,
                        }),
                    inject: [
                        InboxEventRepositoryToken,
                        InboxPartitionRepositoryToken,
                        PartitionAssignerToken,
                        IntegrationEventsEncryptionServiceToken,
                        InboxRetryPolicyToken,
                        IntegrationEventsForFeatureOptionsToken,
                    ],
                },

                {
                    provide: EventOutboxToken,
                    useFactory: (
                        encryptionService: IIntegrationEventsEncryptionService,
                        assigner: IPartitionAssigner,
                        repository: IOutboxEventRepository
                    ) =>
                        new EventOutbox(
                            {
                                context: options.context,
                                connectionName: options.connectionName,
                            },
                            repository,
                            assigner,
                            encryptionService
                        ),
                    inject: [IntegrationEventsEncryptionServiceToken, PartitionAssignerToken, OutboxEventRepositoryToken],
                },

                {
                    provide: EventInboxToken,
                    useFactory: (repository: IInboxEventRepository, assigner: IPartitionAssigner) =>
                        new EventInbox(
                            {
                                context: options.context,
                                connectionName: options.connectionName,
                            },
                            repository,
                            assigner
                        ),
                    inject: [InboxEventRepositoryToken, PartitionAssignerToken],
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
