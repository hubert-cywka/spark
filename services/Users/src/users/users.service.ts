import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "@/users/entities/user.entity";
import { User } from "@/users/objects/user";

@Injectable()
export class UsersService {
    private logger = new Logger();

    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>
    ) {}

    public async findOneById(id: string): Promise<User | null> {
        try {
            const result = await this.usersRepository.findOne({
                where: { id },
            });

            if (!result) {
                this.logger.log("User not found.", { userId: id });
                return null;
            }

            // TODO: Map to DTO
            return result;
        } catch (err) {
            this.logger.error("Failed to query for user.", { err, userId: id });
            return null;
        }
    }

    public async findOneByEmail(email: string): Promise<User | null> {
        try {
            const result = await this.usersRepository.findOne({
                where: { email },
            });

            if (!result) {
                this.logger.log("User not found.", { email });
                return null;
            }

            // TODO: Map to DTO
            return result;
        } catch (err) {
            this.logger.error("Failed to query for user.", { err, email });
            return null;
        }
    }
}
