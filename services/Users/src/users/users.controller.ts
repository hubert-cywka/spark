import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

export type User = {
    name: string;
    email: string;
    password: string;
};

@Controller('users')
export class UsersController {
    @MessagePattern('find_user_by_credentials')
    public async findUserByCredentials(email: string, password: string) {}

    @MessagePattern('create_user')
    public async createUser(user: User) {}
}
