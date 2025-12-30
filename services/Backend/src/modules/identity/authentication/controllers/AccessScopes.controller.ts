import { Body, Controller, ForbiddenException, Inject, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { type FastifyRequest } from "fastify";

import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { ForbiddenError } from "@/common/errors/Forbidden.error";
import { whenError } from "@/common/errors/whenError";
import { AccessGuard } from "@/common/guards/Access.guard";
import {
    type ITwoFactorAuthenticationModuleFacade,
    TwoFactorAuthenticationModuleFacadeToken,
} from "@/modules/identity/2fa/facade/ITwoFactorAuthenticationModule.facade";
import { ActivateAccessScopesDto } from "@/modules/identity/authentication/dto/incoming/ActivateAccessScopes.dto";
import { type IAuthenticationMapper, AuthenticationMapperToken } from "@/modules/identity/authentication/mappers/IAuthentication.mapper";
import {
    type IAuthenticationService,
    AuthenticationServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAuthenticationService";
import { type User } from "@/types/User";

@Controller("scopes")
export class AccessScopesController {
    public constructor(
        @Inject(TwoFactorAuthenticationModuleFacadeToken)
        private readonly twoFactorAuthModule: ITwoFactorAuthenticationModuleFacade,
        @Inject(AuthenticationMapperToken)
        private readonly authenticationMapper: IAuthenticationMapper,
        @Inject(AuthenticationServiceToken)
        private readonly authService: IAuthenticationService
    ) {}

    @Post("activate")
    @UseGuards(AccessGuard)
    async activateAccessScopes(
        @Body() dto: ActivateAccessScopesDto,
        @AuthenticatedUserContext() user: User,
        @Req() request: FastifyRequest
    ) {
        const accessToken = request.headers.authorization?.split(" ")[1];

        if (!accessToken) {
            throw new ForbiddenException();
        }

        const validationResult = await this.twoFactorAuthModule.validateTOTP(user, dto.code, dto.method);

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
