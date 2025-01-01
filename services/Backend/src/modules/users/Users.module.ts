import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@/common/database/Database.module";
import { IInboxEventHandler, InboxEventHandlersToken, IntegrationEventsModule } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { UserEntity } from "@/modules/users/entities/User.entity";
import { UserActivatedEventHandler } from "@/modules/users/events/UserActivatedEvent.handler";
import { UserRegisteredEventHandler } from "@/modules/users/events/UserRegisteredEvent.handler";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants";
import { InitializeUsersModule1735737579670 } from "@/modules/users/infrastructure/database/migrations/1735737579670-InitializeUsersModule";
import { UsersService } from "@/modules/users/services/implementations/Users.service";
import { UsersEventBoxFactory } from "@/modules/users/services/implementations/UsersEventBox.factory";
import { UsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";
import { UsersResolver } from "@/modules/users/Users.resolver";
import { UsersSubscriber } from "@/modules/users/Users.subscriber";

@Module({
    providers: [
        UsersResolver,
        { provide: UsersServiceToken, useClass: UsersService },
        UserActivatedEventHandler,
        UserRegisteredEventHandler,
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [UserActivatedEventHandler, UserRegisteredEventHandler],
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
                migrations: [InitializeUsersModule1735737579670],
            }),
            inject: [ConfigService],
        }),
        IntegrationEventsModule.forFeature({
            eventBoxFactoryClass: UsersEventBoxFactory,
            context: UsersModule.name,
        }),
    ],
    controllers: [UsersSubscriber],
})
export class UsersModule {}
