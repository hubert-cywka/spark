import { Body, Controller, ForbiddenException, HttpCode, HttpStatus, Inject, Post, Res, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type Response } from "express";

import { Cookie } from "@/common/decorators/Cookie.decorator";
import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { ForbiddenError } from "@/common/errors/Forbidden.error";
import { whenError } from "@/common/errors/whenError";
import { type IDomainVerifierService, DomainVerifierServiceToken } from "@/common/services/interfaces/IDomainVerifier.service";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/modules/identity/authentication/constants";
import { LoginDto } from "@/modules/identity/authentication/dto/incoming/Login.dto";
import { RegisterWithCredentialsDto } from "@/modules/identity/authentication/dto/incoming/RegisterWithCredentials.dto";
import { UntrustedDomainError } from "@/modules/identity/authentication/errors/UntrustedDomain.error";
import { type IAuthenticationMapper, AuthenticationMapperToken } from "@/modules/identity/authentication/mappers/IAuthentication.mapper";
import {
    type IAuthenticationService,
    AuthenticationServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import {
    type IRefreshTokenCookieStrategy,
    RefreshTokenCookieStrategyToken,
} from "@/modules/identity/authentication/strategies/refreshToken/IRefreshTokenCookie.strategy";

@Controller("auth")
export class AuthenticationController {
    private readonly refreshTokenCookieMaxAge: number;

    public constructor(
        @Inject(DomainVerifierServiceToken)
        private readonly domainVerifier: IDomainVerifierService,
        @Inject(AuthenticationServiceToken)
        private readonly authService: IAuthenticationService,
        @Inject(AuthenticationMapperToken)
        private readonly authenticationMapper: IAuthenticationMapper,
        @Inject(RefreshTokenCookieStrategyToken)
        private readonly refreshTokenCookieStrategy: IRefreshTokenCookieStrategy,
        configService: ConfigService
    ) {
        this.refreshTokenCookieMaxAge = configService.getOrThrow<number>("modules.identity.refreshToken.expirationTimeInSeconds") * 1000;
    }

    @HttpCode(HttpStatus.CREATED)
    @Post("register")
    async registerWithCredentials(@Body() dto: RegisterWithCredentialsDto) {
        if (!this.domainVerifier.verify(dto.accountActivationRedirectUrl)) {
            throw new UntrustedDomainError(dto.accountActivationRedirectUrl);
        }

        try {
            await this.authService.registerWithCredentials({ email: dto.email, password: dto.password }, dto.accountActivationRedirectUrl);
        } catch (err) {
            whenError(err).is(EntityConflictError).ignore().elseRethrow();
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    async login(@Body() dto: LoginDto, @Res() response: Response) {
        try {
            const result = await this.authService.loginWithCredentials({
                password: dto.password,
                email: dto.email,
            });

            const cookieOptions = this.refreshTokenCookieStrategy.getCookieOptions(this.refreshTokenCookieMaxAge);
            response.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, cookieOptions);
            return response.send(this.authenticationMapper.toAuthenticationResultDTO(result));
        } catch (err) {
            whenError(err)
                .is(EntityNotFoundError)
                .throw(new UnauthorizedException())
                .is(ForbiddenError)
                .throw(new ForbiddenException())
                .elseRethrow();
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post("refresh")
    async refresh(@Res() response: Response, @Cookie(REFRESH_TOKEN_COOKIE_NAME) token: string) {
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const result = await this.authService.redeemRefreshToken(token);

            const cookieOptions = this.refreshTokenCookieStrategy.getCookieOptions(this.refreshTokenCookieMaxAge);
            response.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, cookieOptions);
            return response.send(this.authenticationMapper.toAuthenticationResultDTO(result));
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new UnauthorizedException()).elseRethrow();
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post("logout")
    async logout(@Res() response: Response, @Cookie(REFRESH_TOKEN_COOKIE_NAME) token: string) {
        if (!token) {
            throw new UnauthorizedException();
        }

        await this.authService.logout(token);
        const cookieOptions = {
            ...this.refreshTokenCookieStrategy.getCookieOptions(this.refreshTokenCookieMaxAge),
            maxAge: 0,
        };
        response.cookie(REFRESH_TOKEN_COOKIE_NAME, "", cookieOptions);
        return response.send();
    }
}
