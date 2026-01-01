import { Controller, Delete, Get, Inject, NotFoundException, UseGuards } from "@nestjs/common";

import { AccessScopes } from "@/common/decorators/AccessScope.decorator";
import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { AccessGuard } from "@/common/guards/Access.guard";
import { type IUserMapper, UserMapperToken } from "@/modules/users/mappers/IUser.mapper";
import { type IUsersService, UsersServiceToken } from "@/modules/users/services/interfaces/IUsersService";
import { type User } from "@/types/User";

@Controller("user")
export class UserController {
    public constructor(
        @Inject(UsersServiceToken) private readonly usersService: IUsersService,
        @Inject(UserMapperToken) private readonly userMapper: IUserMapper
    ) {}

    @Get("myself")
    @UseGuards(AccessGuard)
    @AccessScopes("read:account")
    public async getMyself(@AuthenticatedUserContext() user: User) {
        try {
            const result = await this.usersService.getById(user.id);
            return this.userMapper.fromModelToDto(result);
        } catch (e) {
            whenError(e).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @Delete("myself")
    @UseGuards(AccessGuard)
    @AccessScopes("delete:account")
    public async removeMyData(@AuthenticatedUserContext() user: User) {
        try {
            await this.usersService.requestRemovalById(user.id);
        } catch (e) {
            whenError(e).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }
}
