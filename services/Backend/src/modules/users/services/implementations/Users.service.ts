import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "@/modules/users/entities/User.entity";
import { UserAlreadyExistsError } from "@/modules/users/errors/UserAlreadyExists.error";
import { UserNotFoundError } from "@/modules/users/errors/UserNotFound.error";
import { User } from "@/modules/users/models/User.model";
import { IUsersService } from "@/modules/users/services/interfaces/IUsers.service";

@Injectable()
export class UsersService implements IUsersService {
    private readonly logger = new Logger();

    public constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>
    ) {}

    public async findOneById(id: string): Promise<User> {
        const user = await this.repository.findOne({ where: { id } });

        if (!user) {
            this.logger.warn({ userId: id }, "Couldn't find user.");
            throw new UserNotFoundError();
        }

        return user;
    }

    public async create(user: User): Promise<User> {
        const savedUser = await this.repository.save(user);

        if (!savedUser) {
            this.logger.warn({ userId: user.id, email: user.email }, "User already exists.");
            throw new UserAlreadyExistsError();
        }

        return savedUser;
    }

    public async activate(id: string): Promise<User> {
        const user = await this.repository.save({ id, isActivated: true });

        if (!user) {
            this.logger.warn({ userId: id }, "Couldn't find user.");
            throw new UserNotFoundError();
        }

        return user;
    }
}
