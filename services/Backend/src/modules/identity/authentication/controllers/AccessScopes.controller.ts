import { Body, Controller, ForbiddenException, Inject, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { type FastifyRequest } from "fastify";

import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { ForbiddenError } from "@/common/errors/Forbidden.error";
import { whenError } from "@/common/errors/whenError";
import { AccessGuard } from "@/common/guards/Access.guard";
import {
    type ITwoFactorAuthenticationFactory,
    TwoFactorAuthenticationFactoryToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthentication.factory";
import { ActivateAccessScopesDto } from "@/modules/identity/authentication/dto/incoming/ActivateAccessScopes.dto";
import { type IAuthenticationMapper, AuthenticationMapperToken } from "@/modules/identity/authentication/mappers/IAuthentication.mapper";
import {
    type IAuthenticationService,
    AuthenticationServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import { IDENTITY_MODULE_DEFAULT_RATE_LIMITING, IDENTITY_MODULE_STRICT_RATE_LIMITING } from "@/modules/identity/shared/constants";
import { type User } from "@/types/User";

@Throttle(IDENTITY_MODULE_DEFAULT_RATE_LIMITING)
@Controller("scopes")
export class AccessScopesController {
    public constructor(
        @Inject(TwoFactorAuthenticationFactoryToken)
        private readonly twoFactorAuthFactory: ITwoFactorAuthenticationFactory,
        @Inject(AuthenticationMapperToken)
        private readonly authenticationMapper: IAuthenticationMapper,
        @Inject(AuthenticationServiceToken)
        private readonly authService: IAuthenticationService
    ) {}

    @Post("activate")
    @UseGuards(AccessGuard)
    @Throttle(IDENTITY_MODULE_STRICT_RATE_LIMITING)
    async activateAccessScopes(
        @Body() dto: ActivateAccessScopesDto,
        @AuthenticatedUserContext() user: User,
        @Req() request: FastifyRequest
    ) {
        const accessToken = request.headers.authorization?.split(" ")[1];

        if (!accessToken) {
            throw new ForbiddenException();
        }

        const twoFactorAuthService = this.twoFactorAuthFactory.createIntegrationService(dto.method);
        const validationResult = await twoFactorAuthService.validateTOTP(user, dto.code);

        if (!validationResult) {
            throw new ForbiddenException();
        }

        try {
            const result = await this.authService.upgradeAccessToken(accessToken, dto.scopes);
            return this.authenticationMapper.toAuthenticationResultDTO(result);
        } catch (err) {
            whenError(err)
                .is(EntityNotFoundError)
                .throw(new UnauthorizedException())
                .is(ForbiddenError)
                .throw(new ForbiddenException())
                .elseRethrow();
        }
    }
}
