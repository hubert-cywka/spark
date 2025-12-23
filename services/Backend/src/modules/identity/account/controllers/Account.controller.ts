import { Body, Controller, HttpCode, HttpStatus, Inject, NotFoundException, Post, Put } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";

import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { ForbiddenError } from "@/common/errors/Forbidden.error";
import { whenError } from "@/common/errors/whenError";
import { type IDomainVerifier, DomainVerifierToken } from "@/common/services/interfaces/IDomainVerifier";
import { RedeemActivationTokenDto } from "@/modules/identity/account/dto/RedeemActivationToken.dto";
import { RequestActivationTokenDto } from "@/modules/identity/account/dto/RequestActivationToken.dto";
import { RequestPasswordResetDto } from "@/modules/identity/account/dto/RequestPasswordReset.dto";
import { UpdatePasswordDto } from "@/modules/identity/account/dto/UpdatePassword.dto";
import {
    type IManagedAccountService,
    ManagedAccountServiceToken,
} from "@/modules/identity/account/services/interfaces/IManagedAccountService";
import { UntrustedDomainError } from "@/modules/identity/authentication/errors/UntrustedDomain.error";
import { IDENTITY_MODULE_DEFAULT_RATE_LIMITING, IDENTITY_MODULE_STRICT_RATE_LIMITING } from "@/modules/identity/shared/constants";

@Throttle(IDENTITY_MODULE_DEFAULT_RATE_LIMITING)
@Controller("account")
export class AccountController {
    constructor(
        @Inject(ManagedAccountServiceToken)
        private accountService: IManagedAccountService,
        @Inject(DomainVerifierToken)
        private readonly domainVerifier: IDomainVerifier
    ) {}

    @HttpCode(HttpStatus.CREATED)
    @Post("password/reset")
    @Throttle(IDENTITY_MODULE_STRICT_RATE_LIMITING)
    async requestPasswordChange(@Body() { email, redirectUrl }: RequestPasswordResetDto) {
        if (!this.domainVerifier.verify(redirectUrl)) {
            throw new UntrustedDomainError(redirectUrl);
        }

        try {
            await this.accountService.requestPasswordChange(email, redirectUrl);
        } catch (err) {
            // Hubert: Due to security reasons, do not give any information about the user, as this endpoint is exposed to public.
            // Those errors do not require any handling and the information about them is logged just before they are thrown.
            whenError(err).is(EntityNotFoundError).ignore().elseRethrow();
        }
    }

    @HttpCode(HttpStatus.CREATED)
    @Put("password")
    @Throttle(IDENTITY_MODULE_STRICT_RATE_LIMITING)
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

    @HttpCode(HttpStatus.CREATED)
    @Post("activation/redeem")
    @Throttle(IDENTITY_MODULE_STRICT_RATE_LIMITING)
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

    @HttpCode(HttpStatus.CREATED)
    @Post("activation/request")
    @Throttle(IDENTITY_MODULE_STRICT_RATE_LIMITING)
    async requestActivationToken(@Body() { email, redirectUrl }: RequestActivationTokenDto) {
        try {
            await this.accountService.requestActivation(email, redirectUrl);
        } catch (err) {
            // Hubert: Due to security reasons, do not give any information about the user, as this endpoint is exposed to public.
            // Those errors do not require any handling and the information about them is logged just before they are thrown.
            whenError(err).is(EntityNotFoundError).ignore().is(EntityConflictError).ignore().elseRethrow();
        }
    }
}
