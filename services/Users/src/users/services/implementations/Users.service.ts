import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "@/users/entities/User.entity";
import { UserAlreadyExistsError } from "@/users/errors/UserAlreadyExists.error";
import { UserNotFoundError } from "@/users/errors/UserNotFound.error";
import { User } from "@/users/models/User";
import { IUsersService } from "@/users/services/interfaces/IUsers.service";

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

    public async create(id: string, email: string): Promise<User> {
        const user = await this.repository.save({ id, email });

        if (!user) {
            this.logger.warn({ userId: id, email }, "User already exists.");
            throw new UserAlreadyExistsError();
        }

        return user;
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
