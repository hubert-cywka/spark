import { Inject, Module } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { getDataSourceToken, TypeOrmModule } from "@nestjs/typeorm";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { ClsModule } from "nestjs-cls";

import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { EventBoxFactory, EventBoxFactoryToken } from "@/common/events/services/EventBox.factory";
import { EventInboxToken } from "@/common/events/services/IEventInbox";
import { type IEventOutbox, EventOutboxToken } from "@/common/events/services/IEventOutbox";
import { UserEntity } from "@/modules/users/entities/User.entity";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants";
import { DatabaseModule } from "@/modules/users/infrastructure/database/Database.module";
import { UsersService } from "@/modules/users/services/implementations/Users.service";
import { UsersEventBoxFactory } from "@/modules/users/services/implementations/UsersEventBox.factory";
import { UsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";
import { UsersResolver } from "@/modules/users/Users.resolver";
import { UsersSubscriber } from "@/modules/users/Users.subscriber";

@Module({
    imports: [
        DatabaseModule,
        ClsModule.forRoot({
            middleware: {
                mount: true,
            },
            plugins: [
                new ClsPluginTransactional({
                    connectionName: USERS_MODULE_DATA_SOURCE,
                    adapter: new TransactionalAdapterTypeOrm({
                        dataSourceToken: getDataSourceToken(USERS_MODULE_DATA_SOURCE),
                    }),
                }),
            ],
        }),
        TypeOrmModule.forFeature([UserEntity, OutboxEventEntity, InboxEventEntity], USERS_MODULE_DATA_SOURCE),
    ],
    providers: [
        UsersResolver,
        {
            provide: EventBoxFactoryToken,
            useClass: UsersEventBoxFactory,
        },
        {
            provide: EventOutboxToken,
            useFactory: (factory: EventBoxFactory) => factory.createOutbox("UsersOutbox"),
            inject: [EventBoxFactoryToken],
        },
        {
            provide: EventInboxToken,
            useFactory: (factory: EventBoxFactory) => factory.createInbox("UsersInbox"),
            inject: [EventBoxFactoryToken],
        },
        { provide: UsersServiceToken, useClass: UsersService },
    ],
    controllers: [UsersSubscriber],
})
export class UsersModule {
    public constructor(@Inject(EventOutboxToken) private readonly outbox: IEventOutbox) {}

    @Cron("*/5 * * * * *")
    private async processOutbox() {
        await this.outbox.process();
    }
}
