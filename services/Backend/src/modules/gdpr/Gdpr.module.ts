import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { CacheModule } from "@/common/cache/Cache.module";
import { DatabaseModule } from "@/common/database/Database.module";
import {
    type IEventPublisher,
    type IInboxEventHandler,
    EventPublisherToken,
    InboxEventHandlersToken,
    IntegrationEvents,
    IntegrationEventsModule,
    IntervalJobScheduleUpdatedEvent,
} from "@/common/events";
import { InboxAndOutbox1749299050551 } from "@/common/events/migrations/1749299050551-inbox-and-outbox";
import { InboxAndOutboxSequenceNumber1753291628862 } from "@/common/events/migrations/1753291628862-inbox-and-outbox-sequence-number";
import { InboxAndOutboxSplitTopicAndSubject1753291628863 } from "@/common/events/migrations/1753291628863-inbox-and-outbox-split-topic-and-subject";
import {
    type IIntegrationEventsJobsOrchestrator,
    IntegrationEventsJobsOrchestratorToken,
} from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";
import {
    type IIntegrationEventsSubscriber,
    IntegrationEventsSubscriberToken,
} from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { fromHours } from "@/common/utils/timeUtils";
import { DataPurgePlanEntity } from "@/modules/gdpr/entities/DataPurgePlan.entity";
import { TenantEntity } from "@/modules/gdpr/entities/Tenant.entity";
import { PurgeJobTriggeredEventHandler } from "@/modules/gdpr/events/PurgeJobTriggeredEvent.handler";
import { TenantCreatedEventHandler } from "@/modules/gdpr/events/TenantCreatedEvent.handler";
import { TenantRemovalRequestedEventHandler } from "@/modules/gdpr/events/TenantRemovalRequestedEvent.handler";
import { TenantRemovedEventHandler } from "@/modules/gdpr/events/TenantRemovedEvent.handler";
import { GDPR_MODULE_DATA_SOURCE } from "@/modules/gdpr/infrastructure/database/constants";
import { RegenerateMigrations1749289951431 } from "@/modules/gdpr/infrastructure/database/migrations/1749289951431-regenerate-migrations";
import { AddTimestamps1752925879790 } from "@/modules/gdpr/infrastructure/database/migrations/1752925879790-AddTimestamps";
import { TenantMapperToken } from "@/modules/gdpr/mappers/ITenant.mapper";
import { TenantMapper } from "@/modules/gdpr/mappers/Tenant.mapper";
import { DataPurgeEventsPublisher } from "@/modules/gdpr/services/implementations/DataPurgeEventsPublisher.service";
import { DataPurgeProcessor } from "@/modules/gdpr/services/implementations/DataPurgeProcessor.service";
import { DataPurgeScheduler } from "@/modules/gdpr/services/implementations/DataPurgeScheduler.service";
import { TenantService } from "@/modules/gdpr/services/implementations/Tenant.service";
import { DataPurgeEventsPublisherToken } from "@/modules/gdpr/services/interfaces/IDataPurgeEventsPublisher.service";
import { DataPurgeProcessorToken } from "@/modules/gdpr/services/interfaces/IDataPurgeProcessor.service";
import { DataPurgeSchedulerToken } from "@/modules/gdpr/services/interfaces/IDataPurgeScheduler.service";
import { TenantServiceToken } from "@/modules/gdpr/services/interfaces/ITenant.service";

@Module({
    providers: [
        { provide: TenantMapperToken, useClass: TenantMapper },
        { provide: TenantServiceToken, useClass: TenantService },
        { provide: DataPurgeSchedulerToken, useClass: DataPurgeScheduler },
        { provide: DataPurgeProcessorToken, useClass: DataPurgeProcessor },
        {
            provide: DataPurgeEventsPublisherToken,
            useClass: DataPurgeEventsPublisher,
        },
        {
            provide: PurgeJobTriggeredEventHandler,
            useClass: PurgeJobTriggeredEventHandler,
        },
        {
            provide: TenantCreatedEventHandler,
            useClass: TenantCreatedEventHandler,
        },
        {
            provide: TenantRemovedEventHandler,
            useClass: TenantRemovedEventHandler,
        },
        {
            provide: TenantRemovalRequestedEventHandler,
            useClass: TenantRemovalRequestedEventHandler,
        },
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [
                TenantCreatedEventHandler,
                TenantRemovedEventHandler,
                TenantRemovalRequestedEventHandler,
                PurgeJobTriggeredEventHandler,
            ],
        },
    ],
    imports: [
        CacheModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                connectionString: configService.getOrThrow<string>("modules.gdpr.cache.connectionString"),
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forRootAsync(GDPR_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.gdpr.database.logging"),
                port: configService.getOrThrow<number>("modules.gdpr.database.port"),
                username: configService.getOrThrow<string>("modules.gdpr.database.username"),
                password: configService.getOrThrow<string>("modules.gdpr.database.password"),
                host: configService.getOrThrow<string>("modules.gdpr.database.host"),
                database: configService.getOrThrow<string>("modules.gdpr.database.name"),
                migrations: [
                    RegenerateMigrations1749289951431,
                    InboxAndOutbox1749299050551,
                    AddTimestamps1752925879790,
                    InboxAndOutboxSequenceNumber1753291628862,
                    InboxAndOutboxSplitTopicAndSubject1753291628863,
                ],
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forFeature(GDPR_MODULE_DATA_SOURCE, [TenantEntity, DataPurgePlanEntity]),
        IntegrationEventsModule.forFeatureAsync({
            context: GdprModule.name,
            consumerGroupId: "gdpr",
            connectionName: GDPR_MODULE_DATA_SOURCE,
            useFactory: (configService: ConfigService) => ({
                inboxProcessorOptions: {
                    maxAttempts: configService.getOrThrow<number>("events.inbox.processing.maxAttempts"),
                    maxBatchSize: configService.getOrThrow<number>("events.inbox.processing.maxBatchSize"),
                },
                outboxProcessorOptions: {
                    maxAttempts: configService.getOrThrow<number>("events.outbox.processing.maxAttempts"),
                    maxBatchSize: configService.getOrThrow<number>("events.outbox.processing.maxBatchSize"),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [],
})
export class GdprModule implements OnModuleInit {
    public constructor(
        @Inject(IntegrationEventsSubscriberToken)
        private readonly subscriber: IIntegrationEventsSubscriber,
        @Inject(IntegrationEventsJobsOrchestratorToken)
        private readonly orchestrator: IIntegrationEventsJobsOrchestrator,
        @Inject(InboxEventHandlersToken)
        private readonly handlers: IInboxEventHandler[],
        @Inject(EventPublisherToken)
        private readonly eventPublisher: IEventPublisher
    ) {}

    public onModuleInit() {
        this.orchestrator.startProcessingInbox(this.handlers);
        this.orchestrator.startProcessingOutbox();
        this.orchestrator.startClearingInbox();
        this.orchestrator.startClearingOutbox();

        void this.subscriber.listen([
            IntegrationEvents.account.created,
            IntegrationEvents.account.removal.completed,
            IntegrationEvents.account.removal.requested,
            IntegrationEvents.gdpr.purge.triggered,
        ]);

        void this.eventPublisher.enqueueMany([
            new IntervalJobScheduleUpdatedEvent({
                id: "data_purge",
                interval: fromHours(1),
                callback: IntegrationEvents.gdpr.purge.triggered,
            }),
        ]);
    }
}
