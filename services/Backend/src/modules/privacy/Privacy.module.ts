import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

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
import { HealthCheckModule } from "@/modules/healthcheck/HealthCheck.module";
import {
    type IHealthCheckProbesRegistry,
    HealthCheckProbesRegistryToken,
} from "@/modules/healthcheck/services/interfaces/IHealthCheckProbesRegistry";
import { DataExportController } from "@/modules/privacy/controllers/DataExport.controller";
import { DataExportEntity } from "@/modules/privacy/entities/DataExport.entity";
import { DataPurgePlanEntity } from "@/modules/privacy/entities/DataPurgePlan.entity";
import { ExportAttachmentManifestEntity } from "@/modules/privacy/entities/ExportAttachmentManifest.entity";
import { TenantEntity } from "@/modules/privacy/entities/Tenant.entity";
import { DataExportBatchReadyEventHandler } from "@/modules/privacy/events/DataExportBatchReadyEvent.handler";
import { PurgeJobTriggeredEventHandler } from "@/modules/privacy/events/PurgeJobTriggeredEvent.handler";
import { TenantCreatedEventHandler } from "@/modules/privacy/events/TenantCreatedEvent.handler";
import { TenantRemovalRequestedEventHandler } from "@/modules/privacy/events/TenantRemovalRequestedEvent.handler";
import { TenantRemovedEventHandler } from "@/modules/privacy/events/TenantRemovedEvent.handler";
import { PRIVACY_MODULE_DATA_SOURCE } from "@/modules/privacy/infrastructure/database/constants";
import { RegenerateMigrations1749289951431 } from "@/modules/privacy/infrastructure/database/migrations/1749289951431-regenerate-migrations";
import { AddTimestamps1752925879790 } from "@/modules/privacy/infrastructure/database/migrations/1752925879790-AddTimestamps";
import { DataExportScaffolding1766833967020 } from "@/modules/privacy/infrastructure/database/migrations/1766833967020-data-export-scaffolding";
import { DataExportMapper } from "@/modules/privacy/mappers/DataExport.mapper";
import { ExportAttachmentManifestMapper } from "@/modules/privacy/mappers/ExportAttachmentManifest.mapper";
import { DataExportMapperToken } from "@/modules/privacy/mappers/IDataExport.mapper";
import { ExportAttachmentManifestMapperToken } from "@/modules/privacy/mappers/IExportAttachmentManifest.mapper";
import { TenantMapperToken } from "@/modules/privacy/mappers/ITenant.mapper";
import { TenantMapper } from "@/modules/privacy/mappers/Tenant.mapper";
import { DataExportEventsPublisher } from "@/modules/privacy/services/implementations/DataExportEventsPublisher";
import { DataExportService } from "@/modules/privacy/services/implementations/DataExportService";
import { DataPurgeEventsPublisher } from "@/modules/privacy/services/implementations/DataPurgeEventsPublisher";
import { DataPurgeProcessor } from "@/modules/privacy/services/implementations/DataPurgeProcessor";
import { DataPurgeScheduler } from "@/modules/privacy/services/implementations/DataPurgeScheduler";
import { ExportAttachmentManifestService } from "@/modules/privacy/services/implementations/ExportAttachmentManifestService";
import { ExportOrchestrator } from "@/modules/privacy/services/implementations/ExportOrchestrator";
import { ExportScopeCalculator } from "@/modules/privacy/services/implementations/ExportScopeCalculator";
import { TenantService } from "@/modules/privacy/services/implementations/TenantService";
import { DataExportEventsPublisherToken } from "@/modules/privacy/services/interfaces/IDataExportEventsPublisher";
import { DataExportServiceToken } from "@/modules/privacy/services/interfaces/IDataExportService";
import { DataPurgeEventsPublisherToken } from "@/modules/privacy/services/interfaces/IDataPurgeEventsPublisher";
import { DataPurgeProcessorToken } from "@/modules/privacy/services/interfaces/IDataPurgeProcessor";
import { DataPurgeSchedulerToken } from "@/modules/privacy/services/interfaces/IDataPurgeScheduler";
import { ExportAttachmentManifestServiceToken } from "@/modules/privacy/services/interfaces/IExportAttachmentManifestService";
import { ExportOrchestratorToken } from "@/modules/privacy/services/interfaces/IExportOrchestrator";
import { ExportScopeCalculatorToken } from "@/modules/privacy/services/interfaces/IExportScopeCalculator";
import { TenantServiceToken } from "@/modules/privacy/services/interfaces/ITenantService";

// TODO: Consider splitting this module into smaller ones - e.g. exporting logic is not coupled with purge logic
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
            provide: DataExportBatchReadyEventHandler,
            useClass: DataExportBatchReadyEventHandler,
        },
        {
            provide: DataExportEventsPublisherToken,
            useClass: DataExportEventsPublisher,
        },
        {
            provide: DataExportMapperToken,
            useClass: DataExportMapper,
        },
        {
            provide: DataExportServiceToken,
            useClass: DataExportService,
        },
        {
            provide: ExportOrchestratorToken,
            useClass: ExportOrchestrator,
        },
        {
            provide: ExportScopeCalculatorToken,
            useClass: ExportScopeCalculator,
        },
        {
            provide: ExportAttachmentManifestServiceToken,
            useClass: ExportAttachmentManifestService,
        },
        {
            provide: ExportAttachmentManifestMapperToken,
            useClass: ExportAttachmentManifestMapper,
        },
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [
                TenantCreatedEventHandler,
                TenantRemovedEventHandler,
                TenantRemovalRequestedEventHandler,
                PurgeJobTriggeredEventHandler,
                DataExportBatchReadyEventHandler,
            ],
        },
    ],
    imports: [
        HealthCheckModule,
        DatabaseModule.forRootAsync(PRIVACY_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.privacy.database.logging"),
                port: configService.getOrThrow<number>("modules.privacy.database.port"),
                username: configService.getOrThrow<string>("modules.privacy.database.username"),
                password: configService.getOrThrow<string>("modules.privacy.database.password"),
                host: configService.getOrThrow<string>("modules.privacy.database.host"),
                database: configService.getOrThrow<string>("modules.privacy.database.name"),
                migrations: [
                    RegenerateMigrations1749289951431,
                    InboxAndOutbox1749299050551,
                    AddTimestamps1752925879790,
                    InboxAndOutboxSequenceNumber1753291628862,
                    InboxAndOutboxSplitTopicAndSubject1753291628863,
                    DataExportScaffolding1766833967020,
                ],
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forFeature(PRIVACY_MODULE_DATA_SOURCE, [
            TenantEntity,
            DataPurgePlanEntity,
            DataExportEntity,
            ExportAttachmentManifestEntity,
        ]),
        IntegrationEventsModule.forFeatureAsync({
            context: PrivacyModule.name,
            consumerGroupId: "privacy",
            connectionName: PRIVACY_MODULE_DATA_SOURCE,
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
    controllers: [DataExportController],
})
export class PrivacyModule implements OnModuleInit {
    public constructor(
        @Inject(IntegrationEventsSubscriberToken)
        private readonly subscriber: IIntegrationEventsSubscriber,
        @Inject(IntegrationEventsJobsOrchestratorToken)
        private readonly orchestrator: IIntegrationEventsJobsOrchestrator,
        @Inject(InboxEventHandlersToken)
        private readonly handlers: IInboxEventHandler[],
        @Inject(EventPublisherToken)
        private readonly eventPublisher: IEventPublisher,
        @InjectDataSource(PRIVACY_MODULE_DATA_SOURCE)
        private readonly dataSource: DataSource,
        @Inject(HealthCheckProbesRegistryToken)
        private readonly healthCheckProbesService: IHealthCheckProbesRegistry
    ) {}

    public onModuleInit() {
        this.healthCheckProbesService.registerDatabaseConnectionProbe(`database_${PRIVACY_MODULE_DATA_SOURCE}`, this.dataSource);

        this.orchestrator.startProcessingInbox(this.handlers);
        this.orchestrator.startProcessingOutbox();
        this.orchestrator.startClearingInbox();
        this.orchestrator.startClearingOutbox();

        void this.subscriber.listen([
            IntegrationEvents.account.created,
            IntegrationEvents.account.removal.completed,
            IntegrationEvents.account.removal.requested,
            IntegrationEvents.purge.triggered,
            IntegrationEvents.export.batch.ready,
        ]);

        void this.eventPublisher.enqueueMany([
            new IntervalJobScheduleUpdatedEvent({
                id: "data_purge",
                interval: fromHours(1),
                callback: IntegrationEvents.purge.triggered,
            }),
        ]);
    }
}
