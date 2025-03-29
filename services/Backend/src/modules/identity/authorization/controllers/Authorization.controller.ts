import { Controller, HttpCode, HttpStatus, Inject, Put, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";

import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { AuthenticationGuard } from "@/common/guards/Authentication.guard";
import {
    type IAuthorizationService,
    AuthorizationServiceToken,
} from "@/modules/identity/authorization/services/interfaces/IAuthorization.service";
import { type User } from "@/types/User";

@Controller("authorization")
export class AuthorizationController {
    public constructor(
        @Inject(AuthorizationServiceToken)
        private authorizationService: IAuthorizationService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Put("sudo")
    @UseGuards(AuthenticationGuard)
    async requestSudoMode(@Res() response: Response, @AuthenticatedUserContext() user: User) {
        const result = this.authorizationService.getSudoAuthorizationMethod(user);
    }
}
