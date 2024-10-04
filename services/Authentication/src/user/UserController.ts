import { ifError } from "@hcywka/common";
import { Body, ConflictException, Controller, HttpCode, Inject, NotFoundException, Post, Put } from "@nestjs/common";

import { EntityAlreadyExistsError } from "@/common/errors/EntityAlreadyExists.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { RedeemActivationTokenDto } from "@/user/dto/RedeemActivationToken.dto";
import { RequestActivationTokenDto } from "@/user/dto/RequestActivationToken.dto";
import { RequestPasswordResetDto } from "@/user/dto/RequestPasswordReset.dto";
import { UpdatePasswordDto } from "@/user/dto/UpdatePassword.dto";
import { UserAlreadyActivatedError } from "@/user/errors/UserAlreadyActivated.error";
import { UserNotFoundError } from "@/user/errors/UserNotFound.error";
import { IUserService, IUserServiceToken } from "@/user/services/interfaces/IUser.service";

@Controller("auth")
export class UserController {
    constructor(@Inject(IUserServiceToken) private userService: IUserService) {}

    @Post("password/reset")
    async requestPasswordChange(@Body() { email }: RequestPasswordResetDto) {
        try {
            await this.userService.requestPasswordChange(email);
        } catch (err) {
            // HC: Due to security reasons, do not give any information about the user, as this endpoint is exposed to public.
            // Those errors do not require any handling and the information about them is logged just before they are thrown.
            if (err instanceof UserNotFoundError) {
                return;
            } else {
                throw err;
            }
        }
    }

    @Put("password")
    async updatePassword(@Body() { password, passwordChangeToken }: UpdatePasswordDto) {
        try {
            await this.userService.updatePassword(passwordChangeToken, password);
        } catch (err) {
            ifError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @HttpCode(201)
    @Post("/account/activation/redeem")
    async redeemActivationToken(@Body() { activationToken }: RedeemActivationTokenDto) {
        try {
            await this.userService.activate(activationToken);
        } catch (err) {
            ifError(err)
                .is(EntityNotFoundError)
                .throw(new NotFoundException())
                .is(EntityAlreadyExistsError)
                .throw(new ConflictException())
                .elseRethrow();
        }
    }

    @HttpCode(201)
    @Post("/account/activation/request")
    async requestActivationToken(@Body() { email }: RequestActivationTokenDto) {
        try {
            await this.userService.requestActivation(email);
        } catch (err) {
            // HC: Due to security reasons, do not give any information about the user, as this endpoint is exposed to public.
            // Those errors do not require any handling and the information about them is logged just before they are thrown.
            if (err instanceof UserNotFoundError || err instanceof UserAlreadyActivatedError) {
                return;
            } else {
                throw err;
            }
        }
    }
}
