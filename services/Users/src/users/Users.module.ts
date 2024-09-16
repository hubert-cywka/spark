import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "@/users/entities/User.entity";
import { UsersResolver } from "@/users/Users.resolver";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersResolver],
})
export class UsersModule {}
