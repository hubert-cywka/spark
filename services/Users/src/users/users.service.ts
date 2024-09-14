import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "@/users/entities/user.entity";
import { User } from "@/users/objects/user";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>) {}

    public async findOneById(id: string): Promise<User | null> {
        const result = await this.usersRepository.findOne({ where: { id } });

        if (!result) {
            return null;
        }

        // TODO: Map to DTO
        return result;
    }

    public async findOneByEmail(email: string): Promise<User | null> {
        const result = await this.usersRepository.findOne({ where: { email } });

        if (!result) {
            return null;
        }

        // TODO: Map to DTO
        return result;
    }
}
