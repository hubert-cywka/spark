import { Body, Controller, ForbiddenException, Inject, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { type Request } from "express";

import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { ForbiddenError } from "@/common/errors/Forbidden.error";
import { whenError } from "@/common/errors/whenError";
import { AccessGuard } from "@/common/guards/Access.guard";
import { ActivateAccessScopesDto } from "@/modules/identity/authentication/dto/incoming/ActivateAccessScopes.dto";
import { type IAuthenticationMapper, AuthenticationMapperToken } from "@/modules/identity/authentication/mappers/IAuthentication.mapper";
import {
    type IAuthenticationService,
    AuthenticationServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import {
    type ITwoFactorAuthenticationFactory,
    TwoFactorAuthenticationFactoryToken,
} from "@/modules/identity/authentication/services/interfaces/ITwoFactorAuthentication.factory";
import { type User } from "@/types/User";

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

    // TODO
    @Post("activate")
    @UseGuards(AccessGuard)
    async activateAccessScopes(@Body() dto: ActivateAccessScopesDto, @AuthenticatedUserContext() user: User, @Req() request: Request) {
        const accessToken = request.headers.authorization?.split(" ")[1];

        if (!accessToken) {
            throw new ForbiddenException();
        }

        const twoFactorAuthService = this.twoFactorAuthFactory.create(dto.method);
        const validationResult = await twoFactorAuthService.verifyCode(user, dto.code);

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
