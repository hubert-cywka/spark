import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { UserEntity } from "@/user/entities/user.entity";
import { User } from "@/user/models/user.model";

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    private readonly SALT_ROUNDS = 10;

    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>
    ) {}

    public async findByCredentials(email: string, password: string): Promise<User | null> {
        try {
            const user = await this.usersRepository.findOne({
                where: { email },
            });

            if (!user || !(await this.comparePassword(password, user.password))) {
                this.logger.log("Invalid credentials provided.", { email });
                return null;
            }

            return this.mapEntityToModel(user);
        } catch (err) {
            this.logger.error("Error finding user by credentials.", {
                email,
                err,
            });
            return null;
        }
    }

    public async save(email: string, password: string): Promise<User | null> {
        try {
            const existingUser = await this.usersRepository.findOne({
                where: { email },
            });

            if (existingUser) {
                this.logger.log("User already exists.", { email });
                return null;
            }

            const hashedPassword = await this.hashPassword(password);
            const userEntity = this.usersRepository.create({
                email,
                password: hashedPassword,
            });

            const user = await this.usersRepository.save(userEntity);
            return this.mapEntityToModel(user);
        } catch (err) {
            this.logger.error("Error saving user.", { email, err });
            return null;
        }
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
