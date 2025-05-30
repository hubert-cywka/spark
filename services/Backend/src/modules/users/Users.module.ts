import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import { type IInboxEventHandler, InboxEventHandlersToken, IntegrationEventsModule, IntegrationEventTopics } from "@/common/events";
import { KafkaConsumerMetadata } from "@/common/events/drivers/kafka/types";
import {
    type IIntegrationEventsJobsOrchestrator,
    IntegrationEventsJobsOrchestratorToken,
} from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";
import {
    type IIntegrationEventsSubscriber,
    IntegrationEventsSubscriberToken,
} from "@/common/events/services/interfaces/IIntegrationEventsSubscriber";
import { UserController } from "@/modules/users/controllers/User.controller";
import { UserEntity } from "@/modules/users/entities/User.entity";
import { UserActivatedEventHandler } from "@/modules/users/events/UserActivatedEvent.handler";
import { UserCreatedEventHandler } from "@/modules/users/events/UserCreatedEvent.handler";
import { UserRemovedEventHandler } from "@/modules/users/events/UserRemovedEvent.handler";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants";
import { InitializeUsersModule1735737579670 } from "@/modules/users/infrastructure/database/migrations/1735737579670-InitializeUsersModule";
import { AddTenantIdToOutboxAndInbox1743101796654 } from "@/modules/users/infrastructure/database/migrations/1743101796654-addTenantIdToOutboxAndInbox";
import { RemoveUserPersonalInfo1746284981052 } from "@/modules/users/infrastructure/database/migrations/1746284981052-removeUserPersonalInfo";
import { EncryptedEvents1746293623196 } from "@/modules/users/infrastructure/database/migrations/1746293623196-encryptedEvents";
import { AddProcessAfterTimestampToEvent1748202889222 } from "@/modules/users/infrastructure/database/migrations/1748202889222-addProcessAfterTimestampToEvent";
import { UserMapperToken } from "@/modules/users/mappers/IUser.mapper";
import { UserMapper } from "@/modules/users/mappers/User.mapper";
import { UserPublisherService } from "@/modules/users/services/implementations/UserPublisher.service";
import { UsersService } from "@/modules/users/services/implementations/Users.service";
import { UserPublisherServiceToken } from "@/modules/users/services/interfaces/IUserPublisher.service";
import { UsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";

@Module({
    providers: [
        { provide: UserMapperToken, useClass: UserMapper },
        { provide: UsersServiceToken, useClass: UsersService },
        { provide: UserPublisherServiceToken, useClass: UserPublisherService },
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
        DatabaseModule.forRootAsync(USERS_MODULE_DATA_SOURCE, {
            useFactory: (configService: ConfigService) => ({
                logging: configService.getOrThrow<boolean>("modules.users.database.logging"),
                port: configService.getOrThrow<number>("modules.users.database.port"),
                username: configService.getOrThrow<string>("modules.users.database.username"),
                password: configService.getOrThrow<string>("modules.users.database.password"),
                host: configService.getOrThrow<string>("modules.users.database.host"),
                database: configService.getOrThrow<string>("modules.users.database.name"),
                migrations: [
                    InitializeUsersModule1735737579670,
                    AddTenantIdToOutboxAndInbox1743101796654,
                    RemoveUserPersonalInfo1746284981052,
                    EncryptedEvents1746293623196,
                    AddProcessAfterTimestampToEvent1748202889222,
                ],
            }),
            inject: [ConfigService],
        }),
        DatabaseModule.forFeature(USERS_MODULE_DATA_SOURCE, [UserEntity]),
        IntegrationEventsModule.forFeature({
            context: UsersModule.name,
            consumerGroupId: "users",
            connectionName: USERS_MODULE_DATA_SOURCE,
        }),
    ],
    controllers: [UserController],
})
export class UsersModule implements OnModuleInit {
    public constructor(
        @Inject(IntegrationEventsSubscriberToken)
        private readonly subscriber: IIntegrationEventsSubscriber<KafkaConsumerMetadata>,
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

        void this.subscriber.listen({
            topics: [
                IntegrationEventTopics.account.created,
                IntegrationEventTopics.account.activation.completed,
                IntegrationEventTopics.account.removal.completed,
            ],
        });
    }
}
