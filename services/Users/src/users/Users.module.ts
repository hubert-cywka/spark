import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "@/users/entities/User.entity";
import { UsersService } from "@/users/services/implementations/Users.service";
import { IUsersServiceToken } from "@/users/services/interfaces/IUsers.service";
import { UsersResolver } from "@/users/Users.resolver";
import { UsersSubscriber } from "@/users/Users.subscriber";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersResolver, { provide: IUsersServiceToken, useClass: UsersService }],
    controllers: [UsersSubscriber],
})
export class UsersModule {}
