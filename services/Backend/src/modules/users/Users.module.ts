import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getDataSourceToken } from "@nestjs/typeorm";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { ClsModule } from "nestjs-cls";

import { DatabaseModule } from "@/common/database/Database.module";
import { IntegrationEventsModule } from "@/common/events";
import { InboxEventEntity } from "@/common/events/entities/InboxEvent.entity";
import { OutboxEventEntity } from "@/common/events/entities/OutboxEvent.entity";
import { UserEntity } from "@/modules/users/entities/User.entity";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants";
import { UsersService } from "@/modules/users/services/implementations/Users.service";
import { UsersEventBoxFactory } from "@/modules/users/services/implementations/UsersEventBox.factory";
import { UsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";
import { UsersResolver } from "@/modules/users/Users.resolver";
import { UsersSubscriber } from "@/modules/users/Users.subscriber";

@Module({
    imports: [
        DatabaseModule.forRootAsync(USERS_MODULE_DATA_SOURCE, [UserEntity, OutboxEventEntity, InboxEventEntity], {
            useFactory: (configService: ConfigService) => ({
                port: configService.getOrThrow<number>("modules.users.database.port"),
                username: configService.getOrThrow<string>("modules.users.database.username"),
                password: configService.getOrThrow<string>("modules.users.database.password"),
                host: configService.getOrThrow<string>("modules.users.database.host"),
                database: configService.getOrThrow<string>("modules.users.database.name"),
                migrations: [],
            }),
            inject: [ConfigService],
        }),
        IntegrationEventsModule.forFeature(UsersEventBoxFactory, UsersModule.name),
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
    ],
    providers: [UsersResolver, { provide: UsersServiceToken, useClass: UsersService }],
    controllers: [UsersSubscriber],
})
export class UsersModule {}
