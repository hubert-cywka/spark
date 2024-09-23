import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { UserEntity } from "@/user/entities/User.entity";
import { InvalidCredentialsError } from "@/user/errors/InvalidCredentials.error";
import { UserAlreadyExistsError } from "@/user/errors/UserAlreadyExists.error";
import { UserNotFoundError } from "@/user/errors/UserNotFound.error";
import { User } from "@/user/models/User.model";
import { IUserService } from "@/user/services/IUser.service";

@Injectable()
export class UserService implements IUserService {
    private readonly logger = new Logger(UserService.name);
    private readonly SALT_ROUNDS = 10;

    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>
    ) {}

    public async findByCredentials(email: string, password: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { email },
        });

        if (!user) {
            this.logger.warn({ email }, "User not found.");
            throw new UserNotFoundError();
        }

        if (!(await this.comparePassword(password, user.password))) {
            this.logger.warn({ email }, "User found, incorrect password.");
            throw new InvalidCredentialsError();
        }

        return this.mapEntityToModel(user);
    }

    public async save(email: string, password: string): Promise<User> {
        const existingUser = await this.usersRepository.findOne({
            where: { email },
        });

        if (existingUser) {
            this.logger.warn({ email }, "User already exists.");
            throw new UserAlreadyExistsError();
        }

        const hashedPassword = await this.hashPassword(password);
        const userEntity = this.usersRepository.create({
            email,
            password: hashedPassword,
        });

        const user = await this.usersRepository.save(userEntity);
        return this.mapEntityToModel(user);
    }

    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    private mapEntityToModel(entity: UserEntity): User {
        return plainToInstance(User, { id: entity.id, email: entity.email });
    }
}
