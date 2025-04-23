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
import { UserController } from "@/modules/users/controllers/User.controller";
import { UserEntity } from "@/modules/users/entities/User.entity";
import { UserActivatedEventHandler } from "@/modules/users/events/UserActivatedEvent.handler";
import { UserRegisteredEventHandler } from "@/modules/users/events/UserRegisteredEvent.handler";
import { UserRemovedEventHandler } from "@/modules/users/events/UserRemovedEvent.handler";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants";
import { InitializeUsersModule1735737579670 } from "@/modules/users/infrastructure/database/migrations/1735737579670-InitializeUsersModule";
import { AddTenantIdToOutboxAndInbox1743101796654 } from "@/modules/users/infrastructure/database/migrations/1743101796654-addTenantIdToOutboxAndInbox";
import { UserMapperToken } from "@/modules/users/mappers/IUser.mapper";
import { UserMapper } from "@/modules/users/mappers/User.mapper";
import { UserPublisherService } from "@/modules/users/services/implementations/UserPublisher.service";
import { UsersService } from "@/modules/users/services/implementations/Users.service";
import { UsersEventBoxFactory } from "@/modules/users/services/implementations/UsersEventBox.factory";
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
            provide: UserRegisteredEventHandler,
            useClass: UserRegisteredEventHandler,
        },
        { provide: UserRemovedEventHandler, useClass: UserRemovedEventHandler },
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [UserActivatedEventHandler, UserRegisteredEventHandler, UserRemovedEventHandler],
        },
    ],
    imports: [
        DatabaseModule.forRootAsync(USERS_MODULE_DATA_SOURCE, [UserEntity, OutboxEventEntity, InboxEventEntity], {
            useFactory: (configService: ConfigService) => ({
                port: configService.getOrThrow<number>("modules.users.database.port"),
                username: configService.getOrThrow<string>("modules.users.database.username"),
                password: configService.getOrThrow<string>("modules.users.database.password"),
                host: configService.getOrThrow<string>("modules.users.database.host"),
                database: configService.getOrThrow<string>("modules.users.database.name"),
                migrations: [InitializeUsersModule1735737579670, AddTenantIdToOutboxAndInbox1743101796654],
            }),
            inject: [ConfigService],
        }),
        IntegrationEventsModule.forFeature({
            context: UsersModule.name,
            eventBoxFactory: {
                useClass: UsersEventBoxFactory,
            },
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
        private readonly handlers: IInboxEventHandler[]
    ) {}

    public onModuleInit() {
        this.orchestrator.start(this.handlers);

        void this.subscriber.listen([
            {
                name: "codename_users_account",
                stream: IntegrationEventStreams.account,
                subjects: [
                    IntegrationEventTopics.account.registration.completed,
                    IntegrationEventTopics.account.activation.completed,
                    IntegrationEventTopics.account.removal.completed,
                ],
            },
        ]);
    }
}
