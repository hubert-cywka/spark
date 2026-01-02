import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { SCHEDULING_MODULE_DATA_SOURCE } from "./infrastructure/database/constants";

import { DatabaseModule } from "@/common/database/Database.module";
import { type IInboxEventHandler, InboxEventHandlersToken, IntegrationEvents, IntegrationEventsModule } from "@/common/events";
import { getIntegrationEventsMigrations } from "@/common/events/migrations";
import {
    type IIntegrationEventsJobsOrchestrator,
    IntegrationEventsJobsOrchestratorToken,
} from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";
import {
    type IIntegrationEventsSubscriber,
    IntegrationEventsSubscriberToken,
} from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { HealthCheckModule } from "@/modules/healthcheck/HealthCheck.module";
import {
    type IHealthCheckProbesRegistry,
    HealthCheckProbesRegistryToken,
} from "@/modules/healthcheck/services/interfaces/IHealthCheckProbesRegistry";
import { JobExecutionEntity } from "@/modules/scheduling/entities/JobExecution.entity";
import { JobScheduleEntity } from "@/modules/scheduling/entities/JobScheduleEntity";
import { IntervalJobScheduleUpdatedEventHandler } from "@/modules/scheduling/events/IntervalJobScheduleUpdatedEvent.handler";
import { InitSchedulingModule1764101420518 } from "@/modules/scheduling/infrastructure/database/migrations/1764101420518-init-scheduling-module";
import { JobExecutionsPurgeService } from "@/modules/scheduling/services/implementations/JobExecutionsPurgeService";
import { JobScheduleConfigurationService } from "@/modules/scheduling/services/implementations/JobScheduleConfigurationService";
import { JobScheduler } from "@/modules/scheduling/services/implementations/JobScheduler";
import { JobExecutionsPurgeServiceToken } from "@/modules/scheduling/services/interfaces/IJobExecutionsPurgeService";
import { JobScheduleConfigurationServiceToken } from "@/modules/scheduling/services/interfaces/IJobScheduleConfigurationService";
import { JobSchedulerToken } from "@/modules/scheduling/services/interfaces/IJobScheduler";

@Module({
    providers: [
        {
            provide: JobScheduleConfigurationServiceToken,
            useClass: JobScheduleConfigurationService,
        },
        {
            provide: JobSchedulerToken,
            useClass: JobScheduler,
        },
        {
            provide: JobExecutionsPurgeServiceToken,
            useClass: JobExecutionsPurgeService,
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
        HealthCheckModule,
        DatabaseModule.forRootAsync(SCHEDULING_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.scheduling.database.logging"),
                port: configService.getOrThrow<number>("modules.scheduling.database.port"),
                username: configService.getOrThrow<string>("modules.scheduling.database.username"),
                password: configService.getOrThrow<string>("modules.scheduling.database.password"),
                host: configService.getOrThrow<string>("modules.scheduling.database.host"),
                database: configService.getOrThrow<string>("modules.scheduling.database.name"),
                migrations: [...getIntegrationEventsMigrations(), InitSchedulingModule1764101420518],
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
        private readonly handlers: IInboxEventHandler[],
        @InjectDataSource(SCHEDULING_MODULE_DATA_SOURCE)
        private readonly dataSource: DataSource,
        @Inject(HealthCheckProbesRegistryToken)
        private readonly healthCheckProbesService: IHealthCheckProbesRegistry
    ) {}

    public onModuleInit() {
        this.healthCheckProbesService.registerDatabaseConnectionProbe(`database_${SCHEDULING_MODULE_DATA_SOURCE}`, this.dataSource);

        this.orchestrator.startProcessingInbox(this.handlers);
        this.orchestrator.startClearingInbox();
        this.orchestrator.startProcessingOutbox();
        this.orchestrator.startClearingOutbox();

        void this.subscriber.listen([IntegrationEvents.scheduling.intervalJob.updated]);
    }
}
