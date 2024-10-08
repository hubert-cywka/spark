import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import * as crypto from "crypto";
import dayjs from "dayjs";
import { Repository } from "typeorm";

import { UserEntity } from "@/user/entities/User.entity";
import { InvalidCredentialsError } from "@/user/errors/InvalidCredentials.error";
import { UserAlreadyActivatedError } from "@/user/errors/UserAlreadyActivated.error";
import { UserAlreadyExistsError } from "@/user/errors/UserAlreadyExists.error";
import { UserNotFoundError } from "@/user/errors/UserNotFound.error";
import { User } from "@/user/models/User.model";
import { IUserService } from "@/user/services/interfaces/IUser.service";
import { IUserPublisherService, IUserPublisherServiceToken } from "@/user/services/interfaces/IUserPublisher.service";

@Injectable()
export class UserService implements IUserService {
    private readonly logger = new Logger(UserService.name);
    private readonly SALT_ROUNDS = 10;

    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
        @Inject(IUserPublisherServiceToken)
        private readonly publisher: IUserPublisherService
    ) {}

    public async requestPasswordChange(email: string): Promise<void> {
        const user = await this.repository.findOne({
            where: { email },
        });

        if (!user) {
            this.logger.warn({ email }, "User not found.");
            throw new UserNotFoundError();
        }

        const passwordResetToken = this.generateOneTimeUseToken();
        await this.repository.save({ ...user, passwordResetToken });
        await this.publisher.onPasswordResetRequested(user.email, passwordResetToken);
    }

    public async updatePassword(passwordResetToken: string, password: string): Promise<void> {
        const user = await this.repository.findOne({
            where: { passwordResetToken },
        });

        if (!user) {
            this.logger.warn({ passwordResetToken }, "User with that password reset token not found.");
            throw new UserNotFoundError();
        }

        const hashedPassword = await this.hashPassword(password);
        await this.repository.save({
            ...user,
            passwordResetToken: null,
            password: hashedPassword,
        });
    }

    public async findByCredentials(email: string, password: string): Promise<User> {
        const user = await this.repository.findOne({
            where: { email },
        });

        if (!user) {
            this.logger.warn({ email }, "User not found.");
            throw new UserNotFoundError();
        }

        if (!(await this.comparePassword(password, user.password))) {
            this.logger.warn({ id: user.id }, "User found, incorrect password.");
            throw new InvalidCredentialsError();
        }

        if (!user.activatedAt) {
            this.logger.warn({ id: user.id }, "User not activated.");
            throw new InvalidCredentialsError();
        }

        return this.mapEntityToModel(user);
    }

    public async save(email: string, password: string): Promise<User> {
        const existingUser = await this.repository.findOne({
            where: { email },
        });

        if (existingUser) {
            this.logger.warn({ email }, "User already exists.");
            throw new UserAlreadyExistsError();
        }

        const hashedPassword = await this.hashPassword(password);
        const userEntity = this.repository.create({
            email,
            password: hashedPassword,
        });

        const user = await this.repository.save(userEntity);
        return this.mapEntityToModel(user);
    }

    public async activate(activationToken: string): Promise<void> {
        const user = await this.repository.findOne({
            where: { activationToken },
        });

        if (!user) {
            this.logger.warn({ activationToken }, "User with that activation token not found.");
            throw new UserNotFoundError();
        }

        this.assertEligibilityForActivation(user);

        const updatedUser = await this.repository.save({
            ...user,
            activatedAt: dayjs(),
        });
        this.publisher.onUserActivated({
            email: updatedUser.email,
            id: updatedUser.id,
        });
    }

    public async requestActivation(email: string): Promise<void> {
        const user = await this.repository.findOne({
            where: { email },
        });

        if (!user) {
            this.logger.warn({ email }, "User not found.");
            throw new UserNotFoundError();
        }

        this.assertEligibilityForActivation(user);
        const activationToken = this.generateOneTimeUseToken();

        await this.repository.save({ ...user, activationToken });
        this.publisher.onUserActivationTokenRequested(email, activationToken);
    }

    private assertEligibilityForActivation(user: UserEntity): void {
        if (user.activatedAt) {
            this.logger.warn({ userId: user.id, activatedAt: user.activatedAt }, "User already activated.");
            throw new UserAlreadyActivatedError();
        }
    }

    private generateOneTimeUseToken(): string {
        return crypto.randomUUID();
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
