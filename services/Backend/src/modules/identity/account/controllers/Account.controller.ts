import { Body, Controller, HttpCode, Inject, NotFoundException, Post, Put } from "@nestjs/common";

import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { ForbiddenError } from "@/common/errors/Forbidden.error";
import { whenError } from "@/common/errors/whenError";
import { RedeemActivationTokenDto } from "@/modules/identity/account/dto/RedeemActivationToken.dto";
import { RequestActivationTokenDto } from "@/modules/identity/account/dto/RequestActivationToken.dto";
import { RequestPasswordResetDto } from "@/modules/identity/account/dto/RequestPasswordReset.dto";
import { UpdatePasswordDto } from "@/modules/identity/account/dto/UpdatePassword.dto";
import { AccountAlreadyActivatedError } from "@/modules/identity/account/errors/AccountAlreadyActivated.error";
import { AccountNotFoundError } from "@/modules/identity/account/errors/AccountNotFound.error";
import { IAccountService, IAccountServiceToken } from "@/modules/identity/account/services/interfaces/IAccount.service";

@Controller("api/account")
export class AccountController {
    constructor(@Inject(IAccountServiceToken) private accountService: IAccountService) {}

    @Post("password/reset")
    async requestPasswordChange(@Body() { email }: RequestPasswordResetDto) {
        try {
            await this.accountService.requestPasswordChange(email);
        } catch (err) {
            // Hubert: Due to security reasons, do not give any information about the user, as this endpoint is exposed to public.
            // Those errors do not require any handling and the information about them is logged just before they are thrown.
            if (err instanceof AccountNotFoundError) {
                return;
            } else {
                throw err;
            }
        }
    }

    @Put("password")
    async updatePassword(@Body() { password, passwordChangeToken }: UpdatePasswordDto) {
        try {
            await this.accountService.updatePassword(passwordChangeToken, password);
        } catch (err) {
            // Hubert: Due to security reasons, do not inform anyone that the token already expired/was invalidated/was used. Simply return 404 - no valid tokens were found.
            whenError(err)
                .is(EntityNotFoundError)
                .throw(new NotFoundException())
                .is(ForbiddenError)
                .throw(new NotFoundException())
                .elseRethrow();
        }
    }

    @HttpCode(201)
    @Post("activation/redeem")
    async redeemActivationToken(@Body() { activationToken }: RedeemActivationTokenDto) {
        try {
            await this.accountService.activate(activationToken);
        } catch (err) {
            // Hubert: Due to security reasons, do not inform anyone that the token already expired/was invalidated/was used. Simply return 404 - no valid tokens were found.
            whenError(err)
                .is(EntityNotFoundError)
                .throw(new NotFoundException())
                .is(ForbiddenError)
                .throw(new NotFoundException())
                .elseRethrow();
        }
    }

    @HttpCode(201)
    @Post("activation/request")
    async requestActivationToken(@Body() { email }: RequestActivationTokenDto) {
        try {
            await this.accountService.requestActivation(email);
        } catch (err) {
            // Hubert: Due to security reasons, do not give any information about the user, as this endpoint is exposed to public.
            // Those errors do not require any handling and the information about them is logged just before they are thrown.
            if (err instanceof AccountNotFoundError || err instanceof AccountAlreadyActivatedError) {
                return;
            } else {
                throw err;
            }
        }
    }
}
