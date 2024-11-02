import {
    Body,
    ConflictException,
    Controller,
    ForbiddenException,
    HttpCode,
    Inject,
    Post,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CookieOptions, Response } from "express";

import { Cookies } from "@/common/decorators/Cookie.decorator";
import { EntityConflictError } from "@/common/errors/EntityConflictError";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { ForbiddenError } from "@/common/errors/Forbidden.error";
import { whenError } from "@/common/errors/whenError";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/modules/identity/authentication/constants";
import { LoginDto } from "@/modules/identity/authentication/dto/Login.dto";
import { RegisterDto } from "@/modules/identity/authentication/dto/Register.dto";
import { IAuthenticationService, IAuthServiceToken } from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";

@Controller("api/auth")
export class AuthenticationController {
    private readonly refreshTokenCookieMaxAge: number;

    constructor(
        @Inject(IAuthServiceToken) private authService: IAuthenticationService,
        private configService: ConfigService
    ) {
        this.refreshTokenCookieMaxAge = configService.getOrThrow<number>("modules.auth.refreshToken.expirationTimeInSeconds") * 1000;
    }

    @HttpCode(201)
    @Post("register")
    async register(@Body() dto: RegisterDto) {
        try {
            return await this.authService.register(dto);
        } catch (err) {
            whenError(err).is(EntityConflictError).throw(new ConflictException()).elseRethrow();
        }
    }

    @HttpCode(200)
    @Post("login")
    async login(@Body() dto: LoginDto, @Res() response: Response) {
        try {
            const { accessToken, refreshToken } = await this.authService.login(dto);
            this.setRefreshToken(response, refreshToken);

            const identity = await this.authService.getIdentityFromAccessToken(accessToken);
            return response.send({ ...identity, accessToken });
        } catch (err) {
            whenError(err)
                .is(EntityNotFoundError)
                .throw(new UnauthorizedException())
                .is(ForbiddenError)
                .throw(new ForbiddenException())
                .elseRethrow();
        }
    }

    @HttpCode(200)
    @Post("refresh")
    async refresh(@Res() response: Response, @Cookies(REFRESH_TOKEN_COOKIE_NAME) token: string) {
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const { accessToken, refreshToken } = await this.authService.redeemRefreshToken(token);
            this.setRefreshToken(response, refreshToken);

            const identity = await this.authService.getIdentityFromAccessToken(accessToken);
            return response.send({ ...identity, accessToken });
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new UnauthorizedException()).elseRethrow();
        }
    }

    @HttpCode(200)
    @Post("logout")
    async logout(@Res() response: Response, @Cookies(REFRESH_TOKEN_COOKIE_NAME) token: string) {
        if (!token) {
            throw new UnauthorizedException();
        }

        this.clearRefreshToken(response);
        await this.authService.logout(token);
        return response.send();
    }

    private setRefreshToken(response: Response, refreshToken: string) {
        response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, this.getRefreshTokenCookieOptions());
    }

    private clearRefreshToken(response: Response) {
        response.cookie(REFRESH_TOKEN_COOKIE_NAME, "", {
            ...this.getRefreshTokenCookieOptions(),
            maxAge: 0,
        });
    }

    private getRefreshTokenCookieOptions(): CookieOptions {
        return {
            partitioned: true,
            httpOnly: true,
            secure: true,
            maxAge: this.refreshTokenCookieMaxAge,
            sameSite: "strict",
            path: "/api/auth",
        };
    }
}
