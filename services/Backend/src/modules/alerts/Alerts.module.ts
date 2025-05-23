import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import {
    type IInboxEventHandler,
    InboxEventHandlersToken,
    IntegrationEventsModule,
    IntegrationEventStreams,
    IntegrationEventTopics,
} from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
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
import { InitializeInboxAndOutbox1737489799641 } from "@/modules/alerts/infrastructure/database/migrations/1737489799641-InitializeInboxAndOutbox";
import { InitializeAlertsDatabase1737493814968 } from "@/modules/alerts/infrastructure/database/migrations/1737493814968-InitializeAlertsDatabase";
import { ConditionsTableInheritance1737493967162 } from "@/modules/alerts/infrastructure/database/migrations/1737493967162-ConditionsTableInheritance";
import { FixAlertEntity1737494837758 } from "@/modules/alerts/infrastructure/database/migrations/1737494837758-FixAlertEntity";
import { CleanUpAlertsModule1737573565566 } from "@/modules/alerts/infrastructure/database/migrations/1737573565566-CleanUpAlertsModule";
import { FixDaysOfWeekColumnType1737574459955 } from "@/modules/alerts/infrastructure/database/migrations/1737574459955-FixDaysOfWeekColumnType";
import { SwitchFromLastTriggeredAtToNextTriggerAt1738948797659 } from "@/modules/alerts/infrastructure/database/migrations/1738948797659-SwitchFromLastTriggeredAtToNextTriggerAt";
import { AddTenantIdToOutboxAndInbox1743101730316 } from "@/modules/alerts/infrastructure/database/migrations/1743101730316-addTenantIdToOutboxAndInbox";
import { DeleteAlertsOnCascade1743158723835 } from "@/modules/alerts/infrastructure/database/migrations/1743158723835-deleteAlertsOnCascade";
import { EncryptedEvents1746293664099 } from "@/modules/alerts/infrastructure/database/migrations/1746293664099-encryptedEvents";
import { RemoveRecipientEmail1748031512732 } from "@/modules/alerts/infrastructure/database/migrations/1748031512732-RemoveRecipientEmail";
import { AlertMapper } from "@/modules/alerts/mappers/Alert.mapper";
import { AlertMapperToken } from "@/modules/alerts/mappers/IAlert.mapper";
import { RecipientMapperToken } from "@/modules/alerts/mappers/IRecipient.mapper";
import { RecipientMapper } from "@/modules/alerts/mappers/Recipient.mapper";
import { AlertService } from "@/modules/alerts/services/implementations/Alert.service";
import { AlertPublisherService } from "@/modules/alerts/services/implementations/AlertPublisher.service";
import { AlertSchedulerService } from "@/modules/alerts/services/implementations/AlertScheduler.service";
import { AlertsEventBoxFactory } from "@/modules/alerts/services/implementations/AlertsEventBox.factory";
import { AlertsProcessorService } from "@/modules/alerts/services/implementations/AlertsProcessor.service";
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
            useClass: AlertsProcessorService,
        },
        {
            provide: AlertSchedulerServiceToken,
            useClass: AlertSchedulerService,
        },
        { provide: AlertMapperToken, useClass: AlertMapper },
        {
            provide: AlertPublisherServiceToken,
            useClass: AlertPublisherService,
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
        DatabaseModule.forRootAsync(ALERTS_MODULE_DATA_SOURCE, [OutboxEventEntity, InboxEventEntity, AlertEntity, RecipientEntity], {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.alerts.database.logging"),
                port: configService.getOrThrow<number>("modules.alerts.database.port"),
                username: configService.getOrThrow<string>("modules.alerts.database.username"),
                password: configService.getOrThrow<string>("modules.alerts.database.password"),
                host: configService.getOrThrow<string>("modules.alerts.database.host"),
                database: configService.getOrThrow<string>("modules.alerts.database.name"),
                migrations: [
                    InitializeInboxAndOutbox1737489799641,
                    InitializeAlertsDatabase1737493814968,
                    ConditionsTableInheritance1737493967162,
                    FixAlertEntity1737494837758,
                    CleanUpAlertsModule1737573565566,
                    FixDaysOfWeekColumnType1737574459955,
                    SwitchFromLastTriggeredAtToNextTriggerAt1738948797659,
                    AddTenantIdToOutboxAndInbox1743101730316,
                    DeleteAlertsOnCascade1743158723835,
                    EncryptedEvents1746293664099,
                    RemoveRecipientEmail1748031512732,
                ],
            }),
            inject: [ConfigService],
        }),
        IntegrationEventsModule.forFeature({
            context: AlertsModule.name,
            eventBoxFactory: {
                useClass: AlertsEventBoxFactory,
            },
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
        this.orchestrator.start(this.handlers);

        void this.subscriber.listen([
            {
                name: "codename_alerts_account",
                stream: IntegrationEventStreams.account,
                subjects: [IntegrationEventTopics.account.created, IntegrationEventTopics.account.removal.completed],
            },
        ]);
    }
}
