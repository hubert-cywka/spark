import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "@/modules/users/entities/User.entity";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants/connectionName";
import { DatabaseModule } from "@/modules/users/infrastructure/database/Database.module";
import { UsersService } from "@/modules/users/services/implementations/Users.service";
import { IUsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";
import { UsersResolver } from "@/modules/users/Users.resolver";
import { UsersSubscriber } from "@/modules/users/Users.subscriber";

@Module({
    imports: [DatabaseModule, TypeOrmModule.forFeature([UserEntity], USERS_MODULE_DATA_SOURCE)],
    providers: [UsersResolver, { provide: IUsersServiceToken, useClass: UsersService }],
    controllers: [UsersSubscriber],
})
export class UsersModule {}
