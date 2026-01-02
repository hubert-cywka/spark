import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { UserEntity } from "@/modules/users/entities/User.entity";
import { UserAlreadyExistsError } from "@/modules/users/errors/UserAlreadyExists.error";
import { UserNotFoundError } from "@/modules/users/errors/UserNotFound.error";
import { USERS_MODULE_DATA_SOURCE } from "@/modules/users/infrastructure/database/constants";
import { type IUserMapper, UserMapperToken } from "@/modules/users/mappers/IUser.mapper";
import { type User } from "@/modules/users/models/User.model";
import { type IUserEventsPublisher, UserEventsPublisherToken } from "@/modules/users/services/interfaces/IUserEventsPublisher";
import { type IUsersService } from "@/modules/users/services/interfaces/IUsersService";

@Injectable()
export class UsersService implements IUsersService {
    private readonly logger = new Logger(UsersService.name);

    public constructor(
        @InjectRepository(UserEntity, USERS_MODULE_DATA_SOURCE)
        private readonly repository: Repository<UserEntity>,
        @Inject(UserMapperToken) private readonly userMapper: IUserMapper,
        @Inject(UserEventsPublisherToken)
        private readonly publisher: IUserEventsPublisher
    ) {}

    public async getById(id: string): Promise<User> {
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

        const insertionResult = await repository.createQueryBuilder("user").insert().into(UserEntity).values(user).returning("*").execute();
        const insertedUser = insertionResult.raw[0] as UserEntity;

        return this.userMapper.fromEntityToModel(insertedUser);
    }

    public async activateOneById(id: string): Promise<User> {
        const updateResult = await this.getRepository()
            .createQueryBuilder()
            .update(UserEntity)
            .set({ isActivated: true })
            .where("id = :id", { id })
            .returning("*")
            .execute();

        const activatedUser = updateResult.raw[0] as UserEntity;

        if (!activatedUser) {
            this.logger.warn({ userId: id }, "Couldn't find user.");
            throw new UserNotFoundError();
        }

        return this.userMapper.fromEntityToModel(activatedUser);
    }

    public async requestRemovalById(id: string): Promise<void> {
        const result = await this.getById(id);

        await this.publisher.onDataRemovalRequested(result.id, {
            account: {
                id: result.id,
            },
        });
    }

    @Transactional({ connectionName: USERS_MODULE_DATA_SOURCE })
    public async removeOneById(id: string): Promise<void> {
        const repository = this.getRepository();
        const user = await repository.findOne({ where: { id } });

        if (!user) {
            this.logger.warn({ userId: id }, "Couldn't find user.");
            throw new UserNotFoundError();
        }

        await repository.delete({ id: user.id });
    }

    private getRepository(): Repository<UserEntity> {
        return this.repository;
    }
}
