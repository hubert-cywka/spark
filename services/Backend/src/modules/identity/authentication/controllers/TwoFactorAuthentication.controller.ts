import {
    Body,
    ConflictException,
    Controller,
    ForbiddenException,
    Inject,
    NotFoundException,
    Param,
    ParseEnumPipe,
    Post,
    UseGuards,
} from "@nestjs/common";

import { AccessScopes } from "@/common/decorators/AccessScope.decorator";
import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { ForbiddenError } from "@/common/errors/Forbidden.error";
import { whenError } from "@/common/errors/whenError";
import { AccessGuard } from "@/common/guards/Access.guard";
import { Verify2FACodeDto } from "@/modules/identity/authentication/dto/incoming/Verify2FACode.dto";
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

    @Post(":method/issue")
    @UseGuards(AccessGuard)
    async issue2FACode(
        @Param("method", new ParseEnumPipe(TwoFactorAuthenticationMethod))
        method: TwoFactorAuthenticationMethod,
        @AuthenticatedUserContext() user: User
    ) {
        const twoFactorAuthService = this.twoFactorAuthFactory.create(method);

        try {
            await twoFactorAuthService.issueCode(user);
        } catch (err) {
            whenError(err)
                .is(EntityConflictError)
                .throw(new ConflictException())
                .is(EntityNotFoundError)
                .throw(new NotFoundException())
                .is(ForbiddenError)
                .throw(new ForbiddenException())
                .elseRethrow();
        }
    }

    @Post(":method/enable")
    @UseGuards(AccessGuard)
    @AccessScopes("write:2fa")
    async enable2FA(
        @Param("method", new ParseEnumPipe(TwoFactorAuthenticationMethod))
        method: TwoFactorAuthenticationMethod,
        @AuthenticatedUserContext() user: User
    ) {
        const twoFactorAuthService = this.twoFactorAuthFactory.create(method);

        try {
            const result = await twoFactorAuthService.createMethod(user);
            return { url: result };
        } catch (err) {
            whenError(err).is(EntityConflictError).throw(new ConflictException()).elseRethrow();
        }
    }

    @Post(":method/verify")
    @UseGuards(AccessGuard)
    @AccessScopes("write:2fa")
    async verify2FA(
        @Param("method", new ParseEnumPipe(TwoFactorAuthenticationMethod))
        method: TwoFactorAuthenticationMethod,
        @Body() body: Verify2FACodeDto,
        @AuthenticatedUserContext() user: User
    ) {
        const twoFactorAuthService = this.twoFactorAuthFactory.create(method);

        try {
            const result = await twoFactorAuthService.confirmMethod(user, body.code);
            return { status: result };
        } catch (err) {
            whenError(err)
                .is(EntityConflictError)
                .throw(new ConflictException())
                .is(EntityNotFoundError)
                .throw(new NotFoundException())
                .is(ForbiddenError)
                .throw(new ForbiddenException())
                .elseRethrow();
        }
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

        try {
            const result = await twoFactorAuthService.deleteMethod(user);
            return { url: result };
        } catch (err) {
            whenError(err)
                .is(EntityConflictError)
                .throw(new ConflictException())
                .is(EntityNotFoundError)
                .throw(new NotFoundException())
                .elseRethrow();
        }
    }
}
