import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersService } from "./users.service";

import { UserEntity } from "@/users/entities/user.entity";
import { UsersResolver } from "@/users/users.resolver";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersService, UsersResolver],
})
export class UsersModule {}
