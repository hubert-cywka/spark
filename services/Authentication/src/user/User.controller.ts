import { ifError } from "@hcywka/common";
import { Body, ConflictException, Controller, HttpCode, Inject, NotFoundException, Post } from "@nestjs/common";

import { RedeemActivationTokenDto } from "@/auth/dto/RedeemActivationToken.dto";
import { RequestActivationTokenDto } from "@/auth/dto/RequestActivationToken.dto";
import { UserAlreadyActivatedError } from "@/user/errors/UserAlreadyActivated.error";
import { UserNotFoundError } from "@/user/errors/UserNotFound.error";
import { IUserService, IUserServiceToken } from "@/user/services/interfaces/IUser.service";

// TODO: Consider moving this controller to Users service, maybe put it behind GraphQL
@Controller("auth/user")
export class UserController {
    constructor(@Inject(IUserServiceToken) private userService: IUserService) {}

    @HttpCode(201)
    @Post("activation/redeem")
    async redeemActivationToken(@Body() { activationToken }: RedeemActivationTokenDto) {
        try {
            await this.userService.activate(activationToken);
        } catch (e) {
            ifError(e)
                .is(UserNotFoundError)
                .throw(new NotFoundException())
                .is(UserAlreadyActivatedError)
                .throw(new ConflictException())
                .elseRethrow();
        }
    }

    @HttpCode(201)
    @Post("activation/request")
    async requestActivationToken(@Body() { email }: RequestActivationTokenDto) {
        try {
            await this.userService.requestActivation(email);
        } catch (e) {
            // HC: Due to security reasons, do not give any information about the user, as this endpoint is exposed to public.
            // Those errors do not require any handling and the information about them is logged just before they are thrown.
            if (e instanceof UserNotFoundError || e instanceof UserAlreadyActivatedError) {
                return;
            } else {
                throw e;
            }
        }
    }
}
