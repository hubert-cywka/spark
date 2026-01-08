import { DynamicModule, Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getRepositoryToken, InjectDataSource, TypeOrmModule } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

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
import {
    type IIntegrationEventsJobsOrchestrator,
    IntegrationEventsJobsOrchestratorToken,
} from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";
import {
    type IIntegrationEventsSubscriber,
    IntegrationEventsSubscriberToken,
} from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { type IObjectStorage, getObjectStorageToken } from "@/common/objectStorage/services/IObjectStorage";
import { type IObjectStorageAdmin, ObjectStorageAdminToken } from "@/common/objectStorage/services/IObjectStorageAdmin";
import { type ICsvParser, CsvParserToken } from "@/common/services/interfaces/ICsvParser";
import { fromHours } from "@/common/utils/timeUtils";
import { DataExportController } from "@/modules/exports/controllers/DataExport.controller";
import { DataExportEntity } from "@/modules/exports/entities/DataExport.entity";
import { ExportAttachmentManifestEntity } from "@/modules/exports/entities/ExportAttachmentManifest.entity";
import { TenantEntity } from "@/modules/exports/entities/Tenant.entity";
import { DataExportBatchReadyEventHandler } from "@/modules/exports/events/DataExportBatchReadyEvent.handler";
import { DataExportCleanupTriggeredEventHandler } from "@/modules/exports/events/DataExportCleanupTriggeredEvent.handler";
import { TenantCreatedEventHandler } from "@/modules/exports/events/TenantCreatedEvent.handler";
import { TenantRemovedEventHandler } from "@/modules/exports/events/TenantRemovedEvent.handler";
import { EXPORTS_MODULE_DATA_SOURCE } from "@/modules/exports/infrastructure/database/constants";
import { DataExport1767272676880 } from "@/modules/exports/infrastructure/database/migrations/1767272676880-data-export";
import { AddIndexes1767381710806 } from "@/modules/exports/infrastructure/database/migrations/1767381710806-add-indexes";
import { ImproveIndexes1767428478163 } from "@/modules/exports/infrastructure/database/migrations/1767428478163-improve-indexes";
import { SimplifyAttachments1767733325359 } from "@/modules/exports/infrastructure/database/migrations/1767733325359-simplify-attachments";
import { AddValidUntilTimestamp1767790372799 } from "@/modules/exports/infrastructure/database/migrations/1767790372799-add-valid-until-timestamp";
import { TimestampsPrecisionExports1767888180480 } from "@/modules/exports/infrastructure/database/migrations/1767888180480-timestamps-precision-exports";
import { MoreTimestampsPrecisionExports1767888501796 } from "@/modules/exports/infrastructure/database/migrations/1767888501796-more-timestamps-precision-exports";
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
import { EXPORTS_OBJECT_STORAGE_KEY } from "@/modules/exports/shared/constants/objectStorage";
import { ExportStatusEntity } from "@/modules/exports/shared/entities/ExportStatus.entity";
import { DataExportStartedEventHandler } from "@/modules/exports/shared/events/DataExportStartedEvent.handler";
import { AddExportStatus1767800772167 } from "@/modules/exports/shared/migrations/1767800772167-add-export-status";
import { AddCursorToExportStatus1767810013954 } from "@/modules/exports/shared/migrations/1767810013954-add-cursor-to-export-status";
import { AddTimestampsToExportStatus1767810389572 } from "@/modules/exports/shared/migrations/1767810389572-add-timestamps-to-export-status";
import { DataExporter } from "@/modules/exports/shared/services/DataExporter";
import { DataExporterToken } from "@/modules/exports/shared/services/IDataExporter";
import { type IDataExportProvider, DataExportProvidersToken } from "@/modules/exports/shared/services/IDataExportProvider";
import { HealthCheckModule } from "@/modules/healthcheck/HealthCheck.module";
import {
    type IHealthCheckProbesRegistry,
    HealthCheckProbesRegistryToken,
} from "@/modules/healthcheck/services/interfaces/IHealthCheckProbesRegistry";
import { UseFactoryArgs } from "@/types/UseFactory";

export interface ExportsModuleForFeatureOptions {
    connectionName: string;
    providers: UseFactoryArgs;
    imports: UseFactoryArgs;
}

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
            provide: DataExportCleanupTriggeredEventHandler,
            useClass: DataExportCleanupTriggeredEventHandler,
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
                DataExportCleanupTriggeredEventHandler,
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
                    ...IntegrationEventsModule.getMigrations(),
                    DataExport1767272676880,
                    AddIndexes1767381710806,
                    ImproveIndexes1767428478163,
                    SimplifyAttachments1767733325359,
                    AddValidUntilTimestamp1767790372799,
                    TimestampsPrecisionExports1767888180480,
                    MoreTimestampsPrecisionExports1767888501796,
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
        private readonly healthCheckProbesService: IHealthCheckProbesRegistry,
        @Inject(EventPublisherToken)
        private readonly eventPublisher: IEventPublisher,
        @Inject(ObjectStorageAdminToken)
        private readonly objectStorageAdmin: IObjectStorageAdmin,
        @Inject(ConfigService)
        private readonly configService: ConfigService
    ) {}

    public static forFeature(options: ExportsModuleForFeatureOptions): DynamicModule {
        return {
            module: ExportsSharedModule,
            imports: [...options.imports, TypeOrmModule.forFeature([ExportStatusEntity], options.connectionName)],
            providers: [
                {
                    provide: DataExporterToken,
                    useFactory: (
                        providers: IDataExportProvider[],
                        publisher: IEventPublisher,
                        parser: ICsvParser,
                        objectStorage: IObjectStorage,
                        repository: Repository<ExportStatusEntity>
                    ) => {
                        return new DataExporter(providers, publisher, parser, objectStorage, repository, options.connectionName);
                    },
                    inject: [
                        DataExportProvidersToken,
                        EventPublisherToken,
                        CsvParserToken,
                        getObjectStorageToken(EXPORTS_OBJECT_STORAGE_KEY),
                        getRepositoryToken(ExportStatusEntity, options.connectionName),
                    ],
                },
                {
                    provide: DataExportStartedEventHandler,
                    useClass: DataExportStartedEventHandler,
                },
                {
                    provide: DataExportProvidersToken,
                    useFactory: (...providers: IDataExportProvider[]) => providers,
                    inject: options.providers,
                },
            ],
            exports: [DataExporterToken, DataExportStartedEventHandler, TypeOrmModule],
        };
    }

    public static getEventHandlersForExporter() {
        return [DataExportStartedEventHandler];
    }

    public static getEventTopicsForExporter() {
        return [IntegrationEvents.export.started];
    }

    public static getMigrationsForExporter() {
        return [AddExportStatus1767800772167, AddCursorToExportStatus1767810013954, AddTimestampsToExportStatus1767810389572];
    }

    public onModuleInit() {
        this.initHealthChecks();
        void this.initIntegrationEvents();
        void this.initSchedulerJobs();
        void this.initObjectStorage();
    }

    private initHealthChecks() {
        this.healthCheckProbesService.registerDatabaseConnectionProbe(`database_${EXPORTS_MODULE_DATA_SOURCE}`, this.dataSource);
    }

    private async initIntegrationEvents() {
        this.orchestrator.startProcessingInbox(this.handlers);
        this.orchestrator.startProcessingOutbox();
        this.orchestrator.startClearingInbox();
        this.orchestrator.startClearingOutbox();

        await this.subscriber.listen([
            IntegrationEvents.account.created,
            IntegrationEvents.account.removal.completed,
            IntegrationEvents.export.batch.ready,
            IntegrationEvents.export.cleanup.triggered,
        ]);
    }

    private async initSchedulerJobs() {
        await this.eventPublisher.enqueueMany([
            new IntervalJobScheduleUpdatedEvent({
                id: "exports_cleanup",
                interval: fromHours(1),
                callback: IntegrationEvents.export.cleanup.triggered,
            }),
        ]);
    }

    private async initObjectStorage() {
        const bucketName = this.configService.getOrThrow<string>("s3.buckets.exports.name");
        const ttl = this.configService.getOrThrow<number>("modules.exports.expiration.ttlInDays");
        await this.objectStorageAdmin.setBucketTTL(ttl, bucketName);
    }
}

export class ExportsSharedModule {}
