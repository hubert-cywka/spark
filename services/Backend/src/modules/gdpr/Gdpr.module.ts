import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import { type IInboxEventHandler, InboxEventHandlersToken, IntegrationEventsModule, IntegrationEventTopics } from "@/common/events";
import {
    type IIntegrationEventsJobsOrchestrator,
    IntegrationEventsJobsOrchestratorToken,
} from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";
import {
    type IIntegrationEventsSubscriber,
    IntegrationEventsSubscriberToken,
} from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { DataPurgePlanEntity } from "@/modules/gdpr/entities/DataPurgePlan.entity";
import { TenantEntity } from "@/modules/gdpr/entities/Tenant.entity";
import { TenantCreatedEventHandler } from "@/modules/gdpr/events/TenantCreatedEvent.handler";
import { TenantRemovalRequestedEventHandler } from "@/modules/gdpr/events/TenantRemovalRequestedEvent.handler";
import { TenantRemovedEventHandler } from "@/modules/gdpr/events/TenantRemovedEvent.handler";
import { GDPR_MODULE_DATA_SOURCE } from "@/modules/gdpr/infrastructure/database/constants";
import { AddTenantEntity1743100640810 } from "@/modules/gdpr/infrastructure/database/migrations/1743100640810-addTenantEntity";
import { AddTenantIdToOutboxAndInbox1743101706566 } from "@/modules/gdpr/infrastructure/database/migrations/1743101706566-addTenantIdToOutboxAndInbox";
import { AddDataPurgePlans1743151982101 } from "@/modules/gdpr/infrastructure/database/migrations/1743151982101-addDataPurgePlans";
import { AddProcessedAtTimestamp1743153555989 } from "@/modules/gdpr/infrastructure/database/migrations/1743153555989-addProcessedAtTimestamp";
import { DeleteOnCascade1743158769846 } from "@/modules/gdpr/infrastructure/database/migrations/1743158769846-deleteOnCascade";
import { EncryptedEvents1746293676452 } from "@/modules/gdpr/infrastructure/database/migrations/1746293676452-encryptedEvents";
import { AddRemoveAtTimestampToPurgePlan1747944544022 } from "@/modules/gdpr/infrastructure/database/migrations/1747944544022-addRemoveAtTimestampToPurgePlan";
import { AddProcessAfterTimestampToEvent1748202952829 } from "@/modules/gdpr/infrastructure/database/migrations/1748202952829-addProcessAfterTimestampToEvent";
import { ImproveOutboxProcessing1748764641595 } from "@/modules/gdpr/infrastructure/database/migrations/1748764641595-ImproveOutboxProcessing";
import { Cleanup1748765396552 } from "@/modules/gdpr/infrastructure/database/migrations/1748765396552-Cleanup";
import { OutboxIndices1748773002753 } from "@/modules/gdpr/infrastructure/database/migrations/1748773002753-OutboxIndices";
import { TenantMapperToken } from "@/modules/gdpr/mappers/ITenant.mapper";
import { TenantMapper } from "@/modules/gdpr/mappers/Tenant.mapper";
import { DataPurgeService } from "@/modules/gdpr/services/implementations/DataPurge.service";
import { DataPurgePublisherService } from "@/modules/gdpr/services/implementations/DataPurgePublisher.service";
import { TenantService } from "@/modules/gdpr/services/implementations/Tenant.service";
import { DataPurgeServiceToken } from "@/modules/gdpr/services/interfaces/IDataPurge.service";
import { DataPurgePublisherServiceToken } from "@/modules/gdpr/services/interfaces/IDataPurgePublisher.service";
import { TenantServiceToken } from "@/modules/gdpr/services/interfaces/ITenant.service";

@Module({
    providers: [
        { provide: TenantMapperToken, useClass: TenantMapper },
        { provide: TenantServiceToken, useClass: TenantService },
        { provide: DataPurgeServiceToken, useClass: DataPurgeService },
        {
            provide: DataPurgePublisherServiceToken,
            useClass: DataPurgePublisherService,
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
            inject: [TenantCreatedEventHandler, TenantRemovedEventHandler, TenantRemovalRequestedEventHandler],
        },
    ],
    imports: [
        DatabaseModule.forRootAsync(GDPR_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.gdpr.database.logging"),
                port: configService.getOrThrow<number>("modules.gdpr.database.port"),
                username: configService.getOrThrow<string>("modules.gdpr.database.username"),
                password: configService.getOrThrow<string>("modules.gdpr.database.password"),
                host: configService.getOrThrow<string>("modules.gdpr.database.host"),
                database: configService.getOrThrow<string>("modules.gdpr.database.name"),
                migrations: [
                    AddTenantEntity1743100640810,
                    AddTenantIdToOutboxAndInbox1743101706566,
                    AddDataPurgePlans1743151982101,
                    AddProcessedAtTimestamp1743153555989,
                    DeleteOnCascade1743158769846,
                    EncryptedEvents1746293676452,
                    AddRemoveAtTimestampToPurgePlan1747944544022,
                    AddProcessAfterTimestampToEvent1748202952829,
                    ImproveOutboxProcessing1748764641595,
                    Cleanup1748765396552,
                    OutboxIndices1748773002753,
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
        private readonly handlers: IInboxEventHandler[]
    ) {}

    public onModuleInit() {
        this.orchestrator.startProcessingInbox(this.handlers);
        this.orchestrator.startProcessingOutbox();
        this.orchestrator.startClearingInbox();
        this.orchestrator.startClearingOutbox();

        void this.subscriber.listen([
            IntegrationEventTopics.account.created,
            IntegrationEventTopics.account.removal.completed,
            IntegrationEventTopics.account.removal.requested,
        ]);
    }
}
