import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { CONFIGURATION_MODULE_DATA_SOURCE } from "./infrastructure/database/constants";

import { DatabaseModule } from "@/common/database/Database.module";
import {
    type IInboxEventHandler,
    InboxEventHandlersToken,
    IntegrationEvents,
    IntegrationEventsModule
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
import {TenantEntity} from "@/modules/configuration/entities/Tenant.entity";
import {TenantCreatedEventHandler} from "@/modules/configuration/events/TenantCreatedEvent.handler";
import {TenantRemovedEventHandler} from "@/modules/configuration/events/TenantRemovedEvent.handler";
import {
    InitConfigurationModule1765016363086
} from "@/modules/configuration/infrastructure/database/migrations/1765016363086-init-configuration-module";
import {TenantMapperToken} from "@/modules/configuration/mappers/ITenant.mapper";
import {TenantMapper} from "@/modules/configuration/mappers/Tenant.mapper";
import {TenantService} from "@/modules/configuration/services/implementations/Tenant.service";
import {TenantServiceToken} from "@/modules/configuration/services/interfaces/ITenant.service";

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
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [
                TenantCreatedEventHandler,
                TenantRemovedEventHandler,
            ],
        },
    ],
    imports: [
        DatabaseModule.forRootAsync(CONFIGURATION_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.configuration.database.logging"),
                port: configService.getOrThrow<number>("modules.configuration.database.port"),
                username: configService.getOrThrow<string>("modules.configuration.database.username"),
                password: configService.getOrThrow<string>("modules.configuration.database.password"),
                host: configService.getOrThrow<string>("modules.configuration.database.host"),
                database: configService.getOrThrow<string>("modules.configuration.database.name"),
                migrations: [
                    InboxAndOutbox1749299050551,
                    InboxAndOutboxSequenceNumber1753291628862,
                    InboxAndOutboxSplitTopicAndSubject1753291628863,
                    InitConfigurationModule1765016363086
                ],
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forFeature(CONFIGURATION_MODULE_DATA_SOURCE, [TenantEntity]),
        IntegrationEventsModule.forFeatureAsync({
            context: ConfigurationModule.name,
            consumerGroupId: "configuration",
            connectionName: CONFIGURATION_MODULE_DATA_SOURCE,
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
export class ConfigurationModule implements OnModuleInit {
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
        this.orchestrator.startClearingInbox();
        this.orchestrator.startProcessingOutbox();
        this.orchestrator.startClearingOutbox();

        void this.subscriber.listen([
            IntegrationEvents.account.created,
            IntegrationEvents.account.removal.completed,
        ]);
    }
}
