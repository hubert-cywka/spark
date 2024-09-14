import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersService } from "./users.service";

import { User } from "@/users/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService],
})
export class UsersModule {}
