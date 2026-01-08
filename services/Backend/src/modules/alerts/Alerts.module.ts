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
import { fromSeconds } from "@/common/utils/timeUtils";
import { AlertsController } from "@/modules/alerts/controllers/Alerts.controller";
import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";
import { RecipientEntity } from "@/modules/alerts/entities/Recipient.entity";
import { AlertCheckJobTriggeredEventHandler } from "@/modules/alerts/events/AlertCheckJobTriggeredEvent.handler";
import { RecipientCreatedEventHandler } from "@/modules/alerts/events/RecipientCreatedEvent.handler";
import { RecipientRemovedEventHandler } from "@/modules/alerts/events/RecipientRemovedEvent.handler";
import { ALERTS_MODULE_DATA_SOURCE } from "@/modules/alerts/infrastructure/database/constants";
import { RegenerateMigrations1749289896371 } from "@/modules/alerts/infrastructure/database/migrations/1749289896371-regenerate-migrations";
import { AddTimestamps1752925853545 } from "@/modules/alerts/infrastructure/database/migrations/1752925853545-AddTimestamps";
import { AddIndexes1767381756398 } from "@/modules/alerts/infrastructure/database/migrations/1767381756398-add-indexes";
import { TimestampsPrecisionAlerts1767888108814 } from "@/modules/alerts/infrastructure/database/migrations/1767888108814-timestamps-precision-alerts";
import { MoreTimestampsPrecisionAlerts1767888489727 } from "@/modules/alerts/infrastructure/database/migrations/1767888489727-more-timestamps-precision-alerts";
import { AlertMapper } from "@/modules/alerts/mappers/Alert.mapper";
import { AlertMapperToken } from "@/modules/alerts/mappers/IAlert.mapper";
import { RecipientMapperToken } from "@/modules/alerts/mappers/IRecipient.mapper";
import { RecipientMapper } from "@/modules/alerts/mappers/Recipient.mapper";
import { AlertEventsPublisher } from "@/modules/alerts/services/implementations/AlertEventsPublisher";
import { AlertScheduler } from "@/modules/alerts/services/implementations/AlertScheduler";
import { AlertService } from "@/modules/alerts/services/implementations/AlertService";
import { AlertsProcessor } from "@/modules/alerts/services/implementations/AlertsProcessor";
import { RecipientService } from "@/modules/alerts/services/implementations/RecipientService";
import { AlertEventsPublisherToken } from "@/modules/alerts/services/interfaces/IAlertEventsPublisher";
import { AlertSchedulerToken } from "@/modules/alerts/services/interfaces/IAlertScheduler";
import { AlertServiceToken } from "@/modules/alerts/services/interfaces/IAlertService";
import { AlertsProcessorToken } from "@/modules/alerts/services/interfaces/IAlertsProcessor";
import { RecipientServiceToken } from "@/modules/alerts/services/interfaces/IRecipientService";
import { HealthCheckModule } from "@/modules/healthcheck/HealthCheck.module";
import {
    type IHealthCheckProbesRegistry,
    HealthCheckProbesRegistryToken,
} from "@/modules/healthcheck/services/interfaces/IHealthCheckProbesRegistry";

@Module({
    providers: [
        { provide: RecipientMapperToken, useClass: RecipientMapper },
        { provide: RecipientServiceToken, useClass: RecipientService },
        { provide: AlertServiceToken, useClass: AlertService },
        {
            provide: AlertsProcessorToken,
            useClass: AlertsProcessor,
        },
        {
            provide: AlertSchedulerToken,
            useClass: AlertScheduler,
        },
        { provide: AlertMapperToken, useClass: AlertMapper },
        {
            provide: AlertEventsPublisherToken,
            useClass: AlertEventsPublisher,
        },
        {
            provide: RecipientCreatedEventHandler,
            useClass: RecipientCreatedEventHandler,
        },
        {
            provide: RecipientRemovedEventHandler,
            useClass: RecipientRemovedEventHandler,
        },
        {
            provide: AlertCheckJobTriggeredEventHandler,
            useClass: AlertCheckJobTriggeredEventHandler,
        },
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [RecipientCreatedEventHandler, RecipientRemovedEventHandler, AlertCheckJobTriggeredEventHandler],
        },
    ],
    imports: [
        HealthCheckModule,
        DatabaseModule.forRootAsync(ALERTS_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.alerts.database.logging"),
                port: configService.getOrThrow<number>("modules.alerts.database.port"),
                username: configService.getOrThrow<string>("modules.alerts.database.username"),
                password: configService.getOrThrow<string>("modules.alerts.database.password"),
                host: configService.getOrThrow<string>("modules.alerts.database.host"),
                database: configService.getOrThrow<string>("modules.alerts.database.name"),
                migrations: [
                    ...IntegrationEventsModule.getMigrations(),
                    RegenerateMigrations1749289896371,
                    AddTimestamps1752925853545,
                    AddIndexes1767381756398,
                    TimestampsPrecisionAlerts1767888108814,
                    MoreTimestampsPrecisionAlerts1767888489727,
                ],
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forFeature(ALERTS_MODULE_DATA_SOURCE, [AlertEntity, RecipientEntity]),
        IntegrationEventsModule.forFeatureAsync({
            context: AlertsModule.name,
            consumerGroupId: "alerts",
            connectionName: ALERTS_MODULE_DATA_SOURCE,
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
    controllers: [AlertsController],
})
export class AlertsModule implements OnModuleInit {
    public constructor(
        @Inject(IntegrationEventsSubscriberToken)
        private readonly subscriber: IIntegrationEventsSubscriber,
        @Inject(IntegrationEventsJobsOrchestratorToken)
        private readonly orchestrator: IIntegrationEventsJobsOrchestrator,
        @Inject(InboxEventHandlersToken)
        private readonly handlers: IInboxEventHandler[],
        @Inject(EventPublisherToken)
        private readonly eventPublisher: IEventPublisher,
        @InjectDataSource(ALERTS_MODULE_DATA_SOURCE)
        private readonly dataSource: DataSource,
        @Inject(HealthCheckProbesRegistryToken)
        private readonly healthCheckProbesService: IHealthCheckProbesRegistry
    ) {}

    public onModuleInit() {
        this.healthCheckProbesService.registerDatabaseConnectionProbe(`database_${ALERTS_MODULE_DATA_SOURCE}`, this.dataSource);

        this.orchestrator.startProcessingInbox(this.handlers);
        this.orchestrator.startProcessingOutbox();
        this.orchestrator.startClearingInbox();
        this.orchestrator.startClearingOutbox();

        void this.subscriber.listen([
            IntegrationEvents.account.created,
            IntegrationEvents.account.removal.completed,
            IntegrationEvents.alert.check.triggered,
        ]);

        void this.eventPublisher.enqueueMany([
            new IntervalJobScheduleUpdatedEvent({
                id: "alerts_check",
                interval: fromSeconds(15),
                callback: IntegrationEvents.alert.check.triggered,
            }),
        ]);
    }
}
