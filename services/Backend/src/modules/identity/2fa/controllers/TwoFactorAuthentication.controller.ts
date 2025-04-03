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
import { plainToClass } from "class-transformer";

import { AccessScopes } from "@/common/decorators/AccessScope.decorator";
import { AuthenticatedUserContext } from "@/common/decorators/AuthenticatedUserContext.decorator";
import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { ForbiddenError } from "@/common/errors/Forbidden.error";
import { whenError } from "@/common/errors/whenError";
import { AccessGuard } from "@/common/guards/Access.guard";
import { EnableApp2FADto } from "@/modules/identity/2fa/dto/EnableApp2FA.dto";
import { Verify2FACodeDto } from "@/modules/identity/2fa/dto/Verify2FACode.dto";
import {
    type ITwoFactorAuthenticationIntegrationMapper,
    TwoFactorAuthenticationIntegrationMapperToken,
} from "@/modules/identity/2fa/mappers/ITwoFactorAuthenticationIntegration.mapper";
import {
    type ITwoFactorAuthenticationFactory,
    TwoFactorAuthenticationFactoryToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthentication.factory";
import {
    type ITwoFactorAuthenticationIntegrationsProviderService,
    TwoFactorAuthenticationMethodsProviderServiceToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationIntegrationsProvider.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { type User } from "@/types/User";

// TODO: Stricter rate limiting
@Controller("2fa")
export class TwoFactorAuthenticationController {
    public constructor(
        @Inject(TwoFactorAuthenticationFactoryToken)
        private readonly twoFactorAuthFactory: ITwoFactorAuthenticationFactory,
        @Inject(TwoFactorAuthenticationMethodsProviderServiceToken)
        private readonly integrationsProvider: ITwoFactorAuthenticationIntegrationsProviderService,
        @Inject(TwoFactorAuthenticationIntegrationMapperToken)
        private readonly mapper: ITwoFactorAuthenticationIntegrationMapper
    ) {}

    @Get("method")
    @UseGuards(AccessGuard)
    async getMethods(@AuthenticatedUserContext() user: User) {
        const methods = await this.integrationsProvider.findActiveIntegrations(user.id);
        return this.mapper.fromModelToDtoBulk(methods);
    }

    @Post("method/:method/issue")
    @UseGuards(AccessGuard)
    async issue2FACode(
        @Param("method", new ParseEnumPipe(TwoFactorAuthenticationMethod))
        method: TwoFactorAuthenticationMethod,
        @AuthenticatedUserContext() user: User
    ) {
        const twoFactorAuthService = this.twoFactorAuthFactory.createIntegrationService(method);

        try {
            await twoFactorAuthService.issueTOTP(user);
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

    @Post("method/app/enable")
    @UseGuards(AccessGuard)
    @AccessScopes("write:2fa")
    async enableApp2FA(@AuthenticatedUserContext() user: User) {
        const twoFactorAuthService = this.twoFactorAuthFactory.createIntegrationService(TwoFactorAuthenticationMethod.AUTHENTICATOR);

        try {
            const result = await twoFactorAuthService.createMethodIntegration(user);
            return plainToClass(EnableApp2FADto, { url: result });
        } catch (err) {
            whenError(err).is(EntityConflictError).throw(new ConflictException()).elseRethrow();
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
        const twoFactorAuthService = this.twoFactorAuthFactory.createIntegrationService(method);

        try {
            await twoFactorAuthService.createMethodIntegration(user);
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
        const twoFactorAuthService = this.twoFactorAuthFactory.createIntegrationService(method);

        try {
            await twoFactorAuthService.confirmMethodIntegration(user, body.code);
        } catch (err) {
            whenError(err)
                .is(EntityNotFoundError)
                .throw(new NotFoundException())
                .is(EntityConflictError)
                .throw(new ConflictException())
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
        const twoFactorAuthService = this.twoFactorAuthFactory.createIntegrationService(method);

        try {
            await twoFactorAuthService.deleteMethodIntegration(user);
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
