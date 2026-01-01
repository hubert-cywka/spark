import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { DatabaseModule } from "@/common/database/Database.module";
import { type IInboxEventHandler, InboxEventHandlersToken, IntegrationEvents, IntegrationEventsModule } from "@/common/events";
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
import { DataExportController } from "@/modules/exports/controllers/DataExport.controller";
import { DataExportEntity } from "@/modules/exports/entities/DataExport.entity";
import { ExportAttachmentManifestEntity } from "@/modules/exports/entities/ExportAttachmentManifest.entity";
import { TenantEntity } from "@/modules/exports/entities/Tenant.entity";
import { DataExportBatchReadyEventHandler } from "@/modules/exports/events/DataExportBatchReadyEvent.handler";
import { DataExportCancelledEventHandler } from "@/modules/exports/events/DataExportCancelledEvent.handler";
import { DataExportCompletedEventHandler } from "@/modules/exports/events/DataExportCompletedEvent.handler";
import { TenantCreatedEventHandler } from "@/modules/exports/events/TenantCreatedEvent.handler";
import { TenantRemovedEventHandler } from "@/modules/exports/events/TenantRemovedEvent.handler";
import { EXPORTS_MODULE_DATA_SOURCE } from "@/modules/exports/infrastructure/database/constants";
import { DataExport1767272676880 } from "@/modules/exports/infrastructure/database/migrations/1767272676880-data-export";
import { DataExportMapper } from "@/modules/exports/mappers/DataExport.mapper";
import { ExportAttachmentManifestMapper } from "@/modules/exports/mappers/ExportAttachmentManifest.mapper";
import { DataExportMapperToken } from "@/modules/exports/mappers/IDataExport.mapper";
import { ExportAttachmentManifestMapperToken } from "@/modules/exports/mappers/IExportAttachmentManifest.mapper";
import { TenantMapperToken } from "@/modules/exports/mappers/ITenant.mapper";
import { TenantMapper } from "@/modules/exports/mappers/Tenant.mapper";
import { DataExportEventsPublisher } from "@/modules/exports/services/implementations/DataExportEventsPublisher";
import { DataExportService } from "@/modules/exports/services/implementations/DataExportService";
import { ExportAttachmentManifestService } from "@/modules/exports/services/implementations/ExportAttachmentManifestService";
import { ExportOrchestrator } from "@/modules/exports/services/implementations/ExportOrchestrator";
import { ExportScopeCalculator } from "@/modules/exports/services/implementations/ExportScopeCalculator";
import { TenantService } from "@/modules/exports/services/implementations/TenantService";
import { DataExportEventsPublisherToken } from "@/modules/exports/services/interfaces/IDataExportEventsPublisher";
import { DataExportServiceToken } from "@/modules/exports/services/interfaces/IDataExportService";
import { ExportAttachmentManifestServiceToken } from "@/modules/exports/services/interfaces/IExportAttachmentManifestService";
import { ExportOrchestratorToken } from "@/modules/exports/services/interfaces/IExportOrchestrator";
import { ExportScopeCalculatorToken } from "@/modules/exports/services/interfaces/IExportScopeCalculator";
import { TenantServiceToken } from "@/modules/exports/services/interfaces/ITenantService";
import { HealthCheckModule } from "@/modules/healthcheck/HealthCheck.module";
import {
    type IHealthCheckProbesRegistry,
    HealthCheckProbesRegistryToken,
} from "@/modules/healthcheck/services/interfaces/IHealthCheckProbesRegistry";

@Module({
    providers: [
        { provide: TenantMapperToken, useClass: TenantMapper },
        { provide: TenantServiceToken, useClass: TenantService },
        {
            provide: TenantCreatedEventHandler,
            useClass: TenantCreatedEventHandler,
        },
        {
            provide: TenantRemovedEventHandler,
            useClass: TenantRemovedEventHandler,
        },
        {
            provide: DataExportBatchReadyEventHandler,
            useClass: DataExportBatchReadyEventHandler,
        },
        {
            provide: DataExportCompletedEventHandler,
            useClass: DataExportCompletedEventHandler,
        },
        {
            provide: DataExportCancelledEventHandler,
            useClass: DataExportCancelledEventHandler,
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
                DataExportBatchReadyEventHandler,
                DataExportCompletedEventHandler,
                DataExportCancelledEventHandler,
            ],
        },
    ],
    imports: [
        HealthCheckModule,
        DatabaseModule.forRootAsync(EXPORTS_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.exports.database.logging"),
                port: configService.getOrThrow<number>("modules.exports.database.port"),
                username: configService.getOrThrow<string>("modules.exports.database.username"),
                password: configService.getOrThrow<string>("modules.exports.database.password"),
                host: configService.getOrThrow<string>("modules.exports.database.host"),
                database: configService.getOrThrow<string>("modules.exports.database.name"),
                migrations: [
                    InboxAndOutbox1749299050551,
                    InboxAndOutboxSequenceNumber1753291628862,
                    InboxAndOutboxSplitTopicAndSubject1753291628863,
                    DataExport1767272676880,
                ],
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forFeature(EXPORTS_MODULE_DATA_SOURCE, [TenantEntity, DataExportEntity, ExportAttachmentManifestEntity]),
        IntegrationEventsModule.forFeatureAsync({
            context: ExportsModule.name,
            consumerGroupId: "exports",
            connectionName: EXPORTS_MODULE_DATA_SOURCE,
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
export class ExportsModule implements OnModuleInit {
    public constructor(
        @Inject(IntegrationEventsSubscriberToken)
        private readonly subscriber: IIntegrationEventsSubscriber,
        @Inject(IntegrationEventsJobsOrchestratorToken)
        private readonly orchestrator: IIntegrationEventsJobsOrchestrator,
        @Inject(InboxEventHandlersToken)
        private readonly handlers: IInboxEventHandler[],
        @InjectDataSource(EXPORTS_MODULE_DATA_SOURCE)
        private readonly dataSource: DataSource,
        @Inject(HealthCheckProbesRegistryToken)
        private readonly healthCheckProbesService: IHealthCheckProbesRegistry
    ) {}

    public onModuleInit() {
        this.healthCheckProbesService.registerDatabaseConnectionProbe(`database_${EXPORTS_MODULE_DATA_SOURCE}`, this.dataSource);

        this.orchestrator.startProcessingInbox(this.handlers);
        this.orchestrator.startProcessingOutbox();
        this.orchestrator.startClearingInbox();
        this.orchestrator.startClearingOutbox();

        void this.subscriber.listen([
            IntegrationEvents.account.created,
            IntegrationEvents.account.removal.completed,
            IntegrationEvents.export.batch.ready,
            IntegrationEvents.export.cancelled,
            IntegrationEvents.export.completed,
        ]);
    }
}
