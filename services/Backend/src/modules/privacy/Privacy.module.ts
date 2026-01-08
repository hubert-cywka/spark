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
import { DataPurgePlanEntity } from "@/modules/privacy/entities/DataPurgePlan.entity";
import { TenantEntity } from "@/modules/privacy/entities/Tenant.entity";
import { PurgeJobTriggeredEventHandler } from "@/modules/privacy/events/PurgeJobTriggeredEvent.handler";
import { TenantCreatedEventHandler } from "@/modules/privacy/events/TenantCreatedEvent.handler";
import { TenantRemovalRequestedEventHandler } from "@/modules/privacy/events/TenantRemovalRequestedEvent.handler";
import { TenantRemovedEventHandler } from "@/modules/privacy/events/TenantRemovedEvent.handler";
import { PRIVACY_MODULE_DATA_SOURCE } from "@/modules/privacy/infrastructure/database/constants";
import { RegenerateMigrations1749289951431 } from "@/modules/privacy/infrastructure/database/migrations/1749289951431-regenerate-migrations";
import { AddTimestamps1752925879790 } from "@/modules/privacy/infrastructure/database/migrations/1752925879790-AddTimestamps";
import { AddIndexes1767381872552 } from "@/modules/privacy/infrastructure/database/migrations/1767381872552-add-indexes";
import { TimestampsPrecisionPrivacy1767888120139 } from "@/modules/privacy/infrastructure/database/migrations/1767888120139-timestamps-precision-privacy";
import { MoreTimestampsPrecisionPrivacy1767888499695 } from "@/modules/privacy/infrastructure/database/migrations/1767888499695-more-timestamps-precision-privacy";
import { TenantMapperToken } from "@/modules/privacy/mappers/ITenant.mapper";
import { TenantMapper } from "@/modules/privacy/mappers/Tenant.mapper";
import { DataPurgeEventsPublisher } from "@/modules/privacy/services/implementations/DataPurgeEventsPublisher";
import { DataPurgeProcessor } from "@/modules/privacy/services/implementations/DataPurgeProcessor";
import { DataPurgeScheduler } from "@/modules/privacy/services/implementations/DataPurgeScheduler";
import { TenantService } from "@/modules/privacy/services/implementations/TenantService";
import { DataPurgeEventsPublisherToken } from "@/modules/privacy/services/interfaces/IDataPurgeEventsPublisher";
import { DataPurgeProcessorToken } from "@/modules/privacy/services/interfaces/IDataPurgeProcessor";
import { DataPurgeSchedulerToken } from "@/modules/privacy/services/interfaces/IDataPurgeScheduler";
import { TenantServiceToken } from "@/modules/privacy/services/interfaces/ITenantService";

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
                    ...IntegrationEventsModule.getMigrations(),
                    RegenerateMigrations1749289951431,
                    AddTimestamps1752925879790,
                    AddIndexes1767381872552,
                    TimestampsPrecisionPrivacy1767888120139,
                    MoreTimestampsPrecisionPrivacy1767888499695,
                ],
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forFeature(PRIVACY_MODULE_DATA_SOURCE, [TenantEntity, DataPurgePlanEntity]),
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
