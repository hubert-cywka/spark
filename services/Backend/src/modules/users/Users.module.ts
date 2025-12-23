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
import { HealthCheckModule } from "@/modules/healthcheck/HealthCheck.module";
import {
    type IHealthCheckProbesRegistry,
    HealthCheckProbesRegistryToken,
} from "@/modules/healthcheck/services/interfaces/IHealthCheckProbesRegistry";
import { UserController } from "@/modules/users/controllers/User.controller";
import { UserEntity } from "@/modules/users/entities/User.entity";
import { UserActivatedEventHandler } from "@/modules/users/events/UserActivatedEvent.handler";
import { UserCreatedEventHandler } from "@/modules/users/events/UserCreatedEvent.handler";
import { UserRemovedEventHandler } from "@/modules/users/events/UserRemovedEvent.handler";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants";
import { RegenerateMigrations1749289881465 } from "@/modules/users/infrastructure/database/migrations/1749289881465-regenerate-migrations";
import { UserMapperToken } from "@/modules/users/mappers/IUser.mapper";
import { UserMapper } from "@/modules/users/mappers/User.mapper";
import { UserEventsPublisher } from "@/modules/users/services/implementations/UserEventsPublisher";
import { UsersService } from "@/modules/users/services/implementations/UsersService";
import { UserEventsPublisherToken } from "@/modules/users/services/interfaces/IUserEventsPublisher";
import { UsersServiceToken } from "@/modules/users/services/interfaces/IUsersService";

@Module({
    providers: [
        { provide: UserMapperToken, useClass: UserMapper },
        { provide: UsersServiceToken, useClass: UsersService },
        { provide: UserEventsPublisherToken, useClass: UserEventsPublisher },
        {
            provide: UserActivatedEventHandler,
            useClass: UserActivatedEventHandler,
        },
        {
            provide: UserCreatedEventHandler,
            useClass: UserCreatedEventHandler,
        },
        { provide: UserRemovedEventHandler, useClass: UserRemovedEventHandler },
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [UserActivatedEventHandler, UserCreatedEventHandler, UserRemovedEventHandler],
        },
    ],
    imports: [
        HealthCheckModule,
        DatabaseModule.forRootAsync(USERS_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.users.database.logging"),
                port: configService.getOrThrow<number>("modules.users.database.port"),
                username: configService.getOrThrow<string>("modules.users.database.username"),
                password: configService.getOrThrow<string>("modules.users.database.password"),
                host: configService.getOrThrow<string>("modules.users.database.host"),
                database: configService.getOrThrow<string>("modules.users.database.name"),
                migrations: [
                    RegenerateMigrations1749289881465,
                    InboxAndOutbox1749299050551,
                    InboxAndOutboxSequenceNumber1753291628862,
                    InboxAndOutboxSplitTopicAndSubject1753291628863,
                ],
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forFeature(USERS_MODULE_DATA_SOURCE, [UserEntity]),
        IntegrationEventsModule.forFeatureAsync({
            context: UsersModule.name,
            consumerGroupId: "users",
            connectionName: USERS_MODULE_DATA_SOURCE,
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
    controllers: [UserController],
})
export class UsersModule implements OnModuleInit {
    public constructor(
        @Inject(IntegrationEventsSubscriberToken)
        private readonly subscriber: IIntegrationEventsSubscriber,
        @Inject(IntegrationEventsJobsOrchestratorToken)
        private readonly orchestrator: IIntegrationEventsJobsOrchestrator,
        @Inject(InboxEventHandlersToken)
        private readonly handlers: IInboxEventHandler[],
        @InjectDataSource(USERS_MODULE_DATA_SOURCE)
        private readonly dataSource: DataSource,
        @Inject(HealthCheckProbesRegistryToken)
        private readonly healthCheckProbesService: IHealthCheckProbesRegistry
    ) {}

    public onModuleInit() {
        this.healthCheckProbesService.registerDatabaseConnectionProbe(`database_${USERS_MODULE_DATA_SOURCE}`, this.dataSource);

        this.orchestrator.startProcessingInbox(this.handlers);
        this.orchestrator.startProcessingOutbox();
        this.orchestrator.startClearingInbox();
        this.orchestrator.startClearingOutbox();

        void this.subscriber.listen([
            IntegrationEvents.account.created,
            IntegrationEvents.account.activation.completed,
            IntegrationEvents.account.removal.completed,
        ]);
    }
}
