import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "@/user/entities/User.entity";
import { UserService } from "@/user/services/implementations/User.service";
import { IUserServiceToken } from "@/user/services/interfaces/IUser.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [{ provide: IUserServiceToken, useClass: UserService }],
    exports: [IUserServiceToken],
})
export class UserModule {}
