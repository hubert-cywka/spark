import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "@/user/entities/User.entity";
import { IUserServiceToken } from "@/user/services/IUser.service";
import { UserService } from "@/user/services/User.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [{ provide: IUserServiceToken, useClass: UserService }],
    exports: [IUserServiceToken],
})
export class UserModule {}
