import { Cookies, ifError } from "@hcywka/common";
import {
    All,
    Body,
    ConflictException,
    Controller,
    ForbiddenException,
    HttpCode,
    Inject,
    Post,
    Res,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SkipThrottle } from "@nestjs/throttler";
import { CookieOptions, Response } from "express";

import { REFRESH_TOKEN_COOKIE_NAME } from "@/auth/constants";
import { LoginDto } from "@/auth/dto/Login.dto";
import { RegisterDto } from "@/auth/dto/Register.dto";
import { AuthenticationGuard } from "@/auth/guards/Authentication.guard";
import { IAuthService, IAuthServiceToken } from "@/auth/services/interfaces/IAuth.service";
import { EntityAlreadyExistsError } from "@/common/errors/EntityAlreadyExists.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { ForbiddenError } from "@/common/errors/Forbidden.error";

@Controller("auth")
export class AuthController {
    constructor(
        @Inject(IAuthServiceToken) private authService: IAuthService,
        private configService: ConfigService
    ) {}

    @SkipThrottle()
    @UseGuards(AuthenticationGuard)
    @All("/authorize/*")
    authorize() {
        return true; // TODO: Attach authorization metadata like permissions etc.
    }

    @HttpCode(201)
    @Post("register")
    async register(@Body() dto: RegisterDto) {
        try {
            return await this.authService.register(dto);
        } catch (err) {
            ifError(err).is(EntityAlreadyExistsError).throw(new ConflictException()).elseRethrow();
        }
    }

    @HttpCode(200)
    @Post("login")
    async login(@Body() dto: LoginDto, @Res() response: Response) {
        try {
            const { accessToken, refreshToken } = await this.authService.login(dto);
            this.setRefreshToken(response, refreshToken);
            return response.send({ accessToken });
        } catch (err) {
            ifError(err)
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
            return response.send({ accessToken });
        } catch (err) {
            ifError(err).is(EntityNotFoundError).throw(new UnauthorizedException()).elseRethrow();
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
        const maxAge = this.configService.getOrThrow<number>("refreshToken.expirationTimeInSeconds") * 1000;
        const secure = this.configService.get<string>("NODE_ENV") === "production";

        return {
            partitioned: true,
            httpOnly: true,
            secure,
            sameSite: "strict",
            path: "/auth",
            maxAge,
        };
    }
}
