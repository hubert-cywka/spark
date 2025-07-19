import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import { type IInboxEventHandler, InboxEventHandlersToken, IntegrationEventsModule, IntegrationEventTopics } from "@/common/events";
import { InboxAndOutbox1749299050551 } from "@/common/events/migrations/1749299050551-inbox-and-outbox";
import {
    type IIntegrationEventsJobsOrchestrator,
    IntegrationEventsJobsOrchestratorToken,
} from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";
import {
    type IIntegrationEventsSubscriber,
    IntegrationEventsSubscriberToken,
} from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { AlertsController } from "@/modules/alerts/controllers/Alerts.controller";
import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";
import { RecipientEntity } from "@/modules/alerts/entities/Recipient.entity";
import { RecipientCreatedEventHandler } from "@/modules/alerts/events/RecipientCreatedEvent.handler";
import { RecipientRemovedEventHandler } from "@/modules/alerts/events/RecipientRemovedEvent.handler";
import { ALERTS_MODULE_DATA_SOURCE } from "@/modules/alerts/infrastructure/database/constants";
import { RegenerateMigrations1749289896371 } from "@/modules/alerts/infrastructure/database/migrations/1749289896371-regenerate-migrations";
import { AlertMapper } from "@/modules/alerts/mappers/Alert.mapper";
import { AlertMapperToken } from "@/modules/alerts/mappers/IAlert.mapper";
import { RecipientMapperToken } from "@/modules/alerts/mappers/IRecipient.mapper";
import { RecipientMapper } from "@/modules/alerts/mappers/Recipient.mapper";
import { AlertService } from "@/modules/alerts/services/implementations/Alert.service";
import { AlertPublisher } from "@/modules/alerts/services/implementations/AlertPublisher.service";
import { AlertScheduler } from "@/modules/alerts/services/implementations/AlertScheduler.service";
import { AlertsProcessor } from "@/modules/alerts/services/implementations/AlertsProcessor.service";
import { RecipientService } from "@/modules/alerts/services/implementations/Recipient.service";
import { AlertServiceToken } from "@/modules/alerts/services/interfaces/IAlert.service";
import { AlertPublisherServiceToken } from "@/modules/alerts/services/interfaces/IAlertPublisher.service";
import { AlertSchedulerServiceToken } from "@/modules/alerts/services/interfaces/IAlertScheduler.service";
import { AlertsProcessorServiceToken } from "@/modules/alerts/services/interfaces/IAlertsProcessor.service";
import { RecipientServiceToken } from "@/modules/alerts/services/interfaces/IRecipient.service";

@Module({
    providers: [
        { provide: RecipientMapperToken, useClass: RecipientMapper },
        { provide: RecipientServiceToken, useClass: RecipientService },
        { provide: AlertServiceToken, useClass: AlertService },
        {
            provide: AlertsProcessorServiceToken,
            useClass: AlertsProcessor,
        },
        {
            provide: AlertSchedulerServiceToken,
            useClass: AlertScheduler,
        },
        { provide: AlertMapperToken, useClass: AlertMapper },
        {
            provide: AlertPublisherServiceToken,
            useClass: AlertPublisher,
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
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [RecipientCreatedEventHandler, RecipientRemovedEventHandler],
        },
    ],
    imports: [
        DatabaseModule.forRootAsync(ALERTS_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.alerts.database.logging"),
                port: configService.getOrThrow<number>("modules.alerts.database.port"),
                username: configService.getOrThrow<string>("modules.alerts.database.username"),
                password: configService.getOrThrow<string>("modules.alerts.database.password"),
                host: configService.getOrThrow<string>("modules.alerts.database.host"),
                database: configService.getOrThrow<string>("modules.alerts.database.name"),
                migrations: [RegenerateMigrations1749289896371, InboxAndOutbox1749299050551],
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
        private readonly handlers: IInboxEventHandler[]
    ) {}

    public onModuleInit() {
        this.orchestrator.startProcessingInbox(this.handlers);
        this.orchestrator.startProcessingOutbox();
        this.orchestrator.startClearingInbox();
        this.orchestrator.startClearingOutbox();

        void this.subscriber.listen([IntegrationEventTopics.account.created, IntegrationEventTopics.account.removal.completed]);
    }
}
