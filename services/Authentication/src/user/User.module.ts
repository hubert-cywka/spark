import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "@/user/entities/User.entity";
import { UserService } from "@/user/services/implementations/User.service";
import { UserPublisherService } from "@/user/services/implementations/UserPublisher.service";
import { IUserServiceToken } from "@/user/services/interfaces/IUser.service";
import { IUserPublisherServiceToken } from "@/user/services/interfaces/IUserPublisher.service";
import { UserController } from "@/user/UserController";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [
        { provide: IUserServiceToken, useClass: UserService },
        { provide: IUserPublisherServiceToken, useClass: UserPublisherService },
    ],
    controllers: [UserController],
    exports: [IUserServiceToken],
})
export class UserModule {}
