import { Controller, Delete, Get, Inject, NotFoundException, UseGuards } from "@nestjs/common";

import { AccessScopes } from "@/common/decorators/AccessScope.decorator";
import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import { AccessGuard } from "@/common/guards/Access.guard";
import { type IUserMapper, UserMapperToken } from "@/modules/users/mappers/IUser.mapper";
import { type IUserPublisherService, UserPublisherServiceToken } from "@/modules/users/services/interfaces/IUserPublisher.service";
import { type IUsersService, UsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";
import { type User } from "@/types/User";

@Controller("user")
export class UserController {
    public constructor(
        @Inject(UsersServiceToken) private readonly usersService: IUsersService,
        @Inject(UserPublisherServiceToken)
        private readonly userPublisher: IUserPublisherService,
        @Inject(UserMapperToken) private readonly userMapper: IUserMapper
    ) {}

    @Get("myself")
    @UseGuards(AccessGuard)
    @AccessScopes("read:account")
    public async getMyself(@AuthenticatedUserContext() user: User) {
        try {
            const result = await this.usersService.findOneById(user.id);
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
            // TODO: Extract to service method
            const result = await this.usersService.findOneById(user.id);
            await this.userPublisher.onDataRemovalRequested(result.id, {
                account: {
                    email: result.email,
                    id: result.id,
                    providerId: user.providerId,
                },
            });
        } catch (e) {
            whenError(e).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }
}
