import { Controller, Inject, Param, ParseEnumPipe, Post, UseGuards } from "@nestjs/common";

import { AccessScopes } from "@/common/decorators/AccessScope.decorator";
import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { AccessGuard } from "@/common/guards/Access.guard";
import {
    type ITwoFactorAuthenticationOptionMapper,
    TwoFactorAuthenticationOptionMapperToken,
} from "@/modules/identity/authentication/mappers/ITwoFactorAuthenticationOption.mapper";
import {
    type ITwoFactorAuthenticationFactory,
    TwoFactorAuthenticationFactoryToken,
} from "@/modules/identity/authentication/services/interfaces/ITwoFactorAuthentication.factory";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/authentication/types/TwoFactorAuthenticationMethod";
import { type User } from "@/types/User";

@Controller("2fa")
export class TwoFactorAuthenticationController {
    public constructor(
        @Inject(TwoFactorAuthenticationOptionMapperToken)
        private readonly twoFactorAuthMapper: ITwoFactorAuthenticationOptionMapper,
        @Inject(TwoFactorAuthenticationFactoryToken)
        private readonly twoFactorAuthFactory: ITwoFactorAuthenticationFactory
    ) {}

    @Post(":method/enable")
    @UseGuards(AccessGuard)
    @AccessScopes("write:2fa")
    async enable2FA(
        @Param("method", new ParseEnumPipe(TwoFactorAuthenticationMethod))
        method: TwoFactorAuthenticationMethod,
        @AuthenticatedUserContext() user: User
    ) {
        const twoFactorAuthService = this.twoFactorAuthFactory.create(method);
    }

    @Post(":method/verify")
    @UseGuards(AccessGuard)
    @AccessScopes("write:2fa")
    async verify2FA(
        @Param("method", new ParseEnumPipe(TwoFactorAuthenticationMethod))
        method: TwoFactorAuthenticationMethod,
        @AuthenticatedUserContext() user: User
    ) {
        const twoFactorAuthService = this.twoFactorAuthFactory.create(method);
    }

    @Post(":method/disable")
    @UseGuards(AccessGuard)
    @AccessScopes("delete:2fa")
    async disable2FA(
        @Param("method", new ParseEnumPipe(TwoFactorAuthenticationMethod))
        method: TwoFactorAuthenticationMethod,
        @AuthenticatedUserContext() user: User
    ) {
        const twoFactorAuthService = this.twoFactorAuthFactory.create(method);
    }
}
