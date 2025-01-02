import { Controller, Get, Inject, NotFoundException, UseGuards } from "@nestjs/common";

import { CurrentUser } from "@/common/decorators/CurrentUser.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { AuthenticationGuard } from "@/common/guards/Authentication.guard";
import { type IUsersService, UsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";
import { type User } from "@/types/User";

@Controller("user")
export class UserController {
    public constructor(@Inject(UsersServiceToken) private readonly usersService: IUsersService) {}

    // TODO: Use mapper
    @Get("myself")
    @UseGuards(AuthenticationGuard)
    public async getMyself(@CurrentUser() user: User) {
        try {
            return await this.usersService.findOneById(user.id);
        } catch (e) {
            whenError(e).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }
}
