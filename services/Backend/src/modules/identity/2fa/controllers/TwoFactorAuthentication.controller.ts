import {
    Body,
    ConflictException,
    Controller,
    ForbiddenException,
    Get,
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
import { Verify2FACodeDto } from "@/modules/identity/2fa/dto/Verify2FACode.dto";
import {
    type ITwoFactorAuthenticationOptionMapper,
    TwoFactorAuthenticationOptionMapperToken,
} from "@/modules/identity/2fa/mappers/ITwoFactorAuthenticationOption.mapper";
import {
    type ITwoFactorAuthenticationFactory,
    TwoFactorAuthenticationFactoryToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthentication.factory";
import {
    type ITwoFactorAuthenticationMethodsProviderService,
    TwoFactorAuthenticationMethodsProviderServiceToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationMethodsProvider.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { type User } from "@/types/User";

@Controller("2fa")
export class TwoFactorAuthenticationController {
    public constructor(
        @Inject(TwoFactorAuthenticationFactoryToken)
        private readonly twoFactorAuthFactory: ITwoFactorAuthenticationFactory,
        @Inject(TwoFactorAuthenticationMethodsProviderServiceToken)
        private readonly methodsProvider: ITwoFactorAuthenticationMethodsProviderService,
        @Inject(TwoFactorAuthenticationOptionMapperToken)
        private readonly mapper: ITwoFactorAuthenticationOptionMapper
    ) {}

    @Get("method")
    @UseGuards(AccessGuard)
    async getMethods(@AuthenticatedUserContext() user: User) {
        const methods = await this.methodsProvider.findEnabledMethods(user.id);
        return this.mapper.fromModelToDtoBulk(methods);
    }

    @Post("method/:method/issue")
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

    @Post("method/:method/enable")
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

    @Post("method/:method/verify")
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

    @Post("method/:method/disable")
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
