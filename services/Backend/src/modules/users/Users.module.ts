import { Module } from "@nestjs/common";
import { getDataSourceToken, TypeOrmModule } from "@nestjs/typeorm";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { ClsModule } from "nestjs-cls";

import { UserEntity } from "@/modules/users/entities/User.entity";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants/connectionName";
import { DatabaseModule } from "@/modules/users/infrastructure/database/Database.module";
import { UsersService } from "@/modules/users/services/implementations/Users.service";
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
        TypeOrmModule.forFeature([UserEntity], USERS_MODULE_DATA_SOURCE),
    ],
    providers: [UsersResolver, { provide: IUsersServiceToken, useClass: UsersService }],
    controllers: [UsersSubscriber],
})
export class UsersModule {}
