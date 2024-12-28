import { Inject, Module } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { getDataSourceToken, TypeOrmModule } from "@nestjs/typeorm";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { ClsModule } from "nestjs-cls";

import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { type IOutbox, OutboxToken } from "@/common/events/services/IOutbox";
import { OutboxFactory, OutboxFactoryToken } from "@/common/events/services/Outbox.factory";
import { UserEntity } from "@/modules/users/entities/User.entity";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants/connectionName";
import { DatabaseModule } from "@/modules/users/infrastructure/database/Database.module";
import { UsersService } from "@/modules/users/services/implementations/Users.service";
import { UsersOutboxFactory } from "@/modules/users/services/implementations/UsersOutbox.factory";
import { IUsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";
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
        TypeOrmModule.forFeature([UserEntity, OutboxEventEntity], USERS_MODULE_DATA_SOURCE),
    ],
    providers: [
        UsersResolver,
        {
            provide: OutboxFactoryToken,
            useClass: UsersOutboxFactory,
        },
        {
            provide: OutboxToken,
            useFactory: (factory: OutboxFactory) => factory.create("UsersOutbox"),
            inject: [OutboxFactoryToken],
        },
        { provide: IUsersServiceToken, useClass: UsersService },
    ],
    controllers: [UsersSubscriber],
})
export class UsersModule {
    public constructor(@Inject(OutboxToken) private readonly outbox: IOutbox) {}

    @Cron("*/5 * * * * *")
    private async processOutbox() {
        await this.outbox.process();
    }
}
