import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "@/modules/users/entities/User.entity";
import { UsersService } from "@/modules/users/services/implementations/Users.service";
import { IUsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";
import { UsersResolver } from "@/modules/users/Users.resolver";
import { UsersSubscriber } from "@/modules/users/Users.subscriber";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersResolver, { provide: IUsersServiceToken, useClass: UsersService }],
    controllers: [UsersSubscriber],
})
export class UsersModule {}
