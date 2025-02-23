import { Controller, Get, Inject, NotFoundException, UseGuards } from "@nestjs/common";

import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { AuthenticationGuard } from "@/common/guards/Authentication.guard";
import { type IUserMapper, UserMapperToken } from "@/modules/users/mappers/IUser.mapper";
import { type IUsersService, UsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";
import { type User } from "@/types/User";

@Controller("user")
export class UserController {
    public constructor(
        @Inject(UsersServiceToken) private readonly usersService: IUsersService,
        @Inject(UserMapperToken) private readonly userMapper: IUserMapper
    ) {}

    @Get("myself")
    @UseGuards(AuthenticationGuard)
    public async getMyself(@AuthenticatedUserContext() user: User) {
        try {
            const result = await this.usersService.findOneById(user.id);
            return this.userMapper.fromModelToDto(result);
        } catch (e) {
            whenError(e).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }
}
