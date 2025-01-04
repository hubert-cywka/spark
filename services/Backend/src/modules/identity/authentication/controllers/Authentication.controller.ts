import {
    Body,
    ConflictException,
    Controller,
    ForbiddenException,
    HttpCode,
    HttpStatus,
    Inject,
    Post,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type Response } from "express";

import { Cookie } from "@/common/decorators/Cookie.decorator";
import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { ForbiddenError } from "@/common/errors/Forbidden.error";
import { whenError } from "@/common/errors/whenError";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/modules/identity/authentication/constants";
import { LoginDto } from "@/modules/identity/authentication/dto/Login.dto";
import { RegisterWithCredentialsDto } from "@/modules/identity/authentication/dto/RegisterWithCredentials.dto";
import {
    type IAuthenticationService,
    IAuthenticationServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import {
    type IRefreshTokenCookieStrategy,
    IRefreshTokenCookieStrategyToken,
} from "@/modules/identity/authentication/strategies/refreshToken/IRefreshTokenCookie.strategy";

// TODO: Use mappers
@Controller("auth")
export class AuthenticationController {
    private readonly refreshTokenCookieMaxAge: number;

    public constructor(
        @Inject(IAuthenticationServiceToken)
        private authService: IAuthenticationService,
        @Inject(IRefreshTokenCookieStrategyToken)
        private refreshTokenCookieStrategy: IRefreshTokenCookieStrategy,
        private configService: ConfigService
    ) {
        this.refreshTokenCookieMaxAge = configService.getOrThrow<number>("modules.identity.refreshToken.expirationTimeInSeconds") * 1000;
    }

    @HttpCode(HttpStatus.CREATED)
    @Post("register")
    async registerWithCredentials(@Body() dto: RegisterWithCredentialsDto) {
        try {
            await this.authService.registerWithCredentials(dto);
        } catch (err) {
            whenError(err).is(EntityConflictError).throw(new ConflictException()).elseRethrow();
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    async login(@Body() dto: LoginDto, @Res() response: Response) {
        try {
            const { accessToken, refreshToken, account } = await this.authService.loginWithCredentials(dto);

            const cookieOptions = this.refreshTokenCookieStrategy.getCookieOptions(this.refreshTokenCookieMaxAge);
            response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieOptions);
            return response.send({ ...account, accessToken });
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
            const { accessToken, refreshToken, account } = await this.authService.redeemRefreshToken(token);

            const cookieOptions = this.refreshTokenCookieStrategy.getCookieOptions(this.refreshTokenCookieMaxAge);
            response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieOptions);
            return response.send({ ...account, accessToken });
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
