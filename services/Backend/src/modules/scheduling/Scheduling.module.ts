import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { SCHEDULING_MODULE_DATA_SOURCE } from "./infrastructure/database/constants";

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
import { JobExecutionEntity } from "@/modules/scheduling/entities/JobExecution.entity";
import { JobScheduleEntity } from "@/modules/scheduling/entities/JobScheduleEntity";
import { IntervalJobScheduleUpdatedEventHandler } from "@/modules/scheduling/events/IntervalJobScheduleUpdatedEvent.handler";
import { InitSchedulingModule1764101420518 } from "@/modules/scheduling/infrastructure/database/migrations/1764101420518-init-scheduling-module";
import { JobExecutionService } from "@/modules/scheduling/services/implementations/JobExecution.service";
import { JobScheduleConfigurationService } from "@/modules/scheduling/services/implementations/JobScheduleConfiguration.service";
import { JobExecutionServiceToken } from "@/modules/scheduling/services/interfaces/IJobExecution.service";
import { JobScheduleConfigurationServiceToken } from "@/modules/scheduling/services/interfaces/IJobScheduleConfiguration.service";

@Module({
    providers: [
        {
            provide: JobScheduleConfigurationServiceToken,
            useClass: JobScheduleConfigurationService,
        },
        {
            provide: JobExecutionServiceToken,
            useClass: JobExecutionService,
        },
        {
            provide: IntervalJobScheduleUpdatedEventHandler,
            useClass: IntervalJobScheduleUpdatedEventHandler,
        },
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [IntervalJobScheduleUpdatedEventHandler],
        },
    ],
    imports: [
        DatabaseModule.forRootAsync(SCHEDULING_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.scheduling.database.logging"),
                port: configService.getOrThrow<number>("modules.scheduling.database.port"),
                username: configService.getOrThrow<string>("modules.scheduling.database.username"),
                password: configService.getOrThrow<string>("modules.scheduling.database.password"),
                host: configService.getOrThrow<string>("modules.scheduling.database.host"),
                database: configService.getOrThrow<string>("modules.scheduling.database.name"),
                migrations: [
                    InboxAndOutbox1749299050551,
                    InboxAndOutboxSequenceNumber1753291628862,
                    InboxAndOutboxSplitTopicAndSubject1753291628863,
                    InitSchedulingModule1764101420518,
                ],
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forFeature(SCHEDULING_MODULE_DATA_SOURCE, [JobScheduleEntity, JobExecutionEntity]),
        IntegrationEventsModule.forFeatureAsync({
            context: SchedulingModule.name,
            consumerGroupId: "scheduling",
            connectionName: SCHEDULING_MODULE_DATA_SOURCE,
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
export class SchedulingModule implements OnModuleInit {
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

        void this.subscriber.listen([IntegrationEvents.scheduling.intervalJob.updated]);
    }
}
