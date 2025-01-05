import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "@/modules/users/entities/User.entity";
import { UserAlreadyExistsError } from "@/modules/users/errors/UserAlreadyExists.error";
import { UserNotFoundError } from "@/modules/users/errors/UserNotFound.error";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants";
import { type IUserMapper, UserMapperToken } from "@/modules/users/mappers/IUser.mapper";
import { type User } from "@/modules/users/models/User.model";
import { type IUsersService } from "@/modules/users/services/interfaces/IUsers.service";

@Injectable()
export class UsersService implements IUsersService {
    private readonly logger = new Logger(UsersService.name);

    public constructor(
        @InjectTransactionHost(USERS_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(UserMapperToken) private readonly userMapper: IUserMapper
    ) {}

    public async findOneById(id: string): Promise<User> {
        const user = await this.getRepository().findOne({ where: { id } });

        if (!user) {
            this.logger.warn({ userId: id }, "Couldn't find user.");
            throw new UserNotFoundError();
        }

        return this.userMapper.fromEntityToModel(user);
    }

    public async create(user: User): Promise<User> {
        const repository = this.getRepository();
        const existingUser = await repository.findOne({
            where: { id: user.id },
        });

        if (existingUser) {
            this.logger.warn({ userId: user.id, email: user.email }, "User already exists.");
            throw new UserAlreadyExistsError();
        }

        // TODO: Use query builder, .save() doesn't return full record
        const result = await this.getRepository().save(user);
        return this.userMapper.fromEntityToModel(result);
    }

    public async activate(id: string): Promise<User> {
        const repository = this.getRepository();
        const user = await repository.findOne({ where: { id } });

        if (!user) {
            this.logger.warn({ userId: id }, "Couldn't find user.");
            throw new UserNotFoundError();
        }

        // TODO: Use query builder, .save() doesn't return full record
        await repository.save({ ...user, isActivated: true });
        return this.userMapper.fromEntityToModel(user);
    }

    private getRepository(): Repository<UserEntity> {
        return this.txHost.tx.getRepository(UserEntity);
    }
}
