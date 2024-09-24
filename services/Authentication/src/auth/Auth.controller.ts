import { Cookies, ifError } from "@hcywka/common";
import {
    All,
    Body,
    ConflictException,
    Controller,
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
import { ConfirmRegistrationDto } from "@/auth/dto/ConfirmRegistration.dto";
import { LoginDto } from "@/auth/dto/Login.dto";
import { RegisterDto } from "@/auth/dto/Register.dto";
import { AuthenticationGuard } from "@/auth/guards/Authentication.guard";
import { IAuthService, IAuthServiceToken } from "@/auth/services/interfaces/IAuth.service";
import { EntityAlreadyExistsError } from "@/common/errors/EntityAlreadyExists.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

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

    @HttpCode(200)
    @Post("login")
    async login(@Body() { email, password }: LoginDto, @Res() response: Response) {
        try {
            const { accessToken, refreshToken } = await this.authService.login(email, password);
            response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, this.getRefreshTokenCookieOptions());
            return response.send({ accessToken });
        } catch (err) {
            ifError(err).is(EntityNotFoundError).throw(new UnauthorizedException()).elseRethrow();
        }
    }

    @HttpCode(201)
    @Post("register")
    async register(@Body() { email, password }: RegisterDto) {
        try {
            await this.authService.register(email, password);
            return { success: true };
        } catch (err) {
            ifError(err).is(EntityAlreadyExistsError).throw(new ConflictException()).elseRethrow();
        }
    }

    @HttpCode(201)
    @Post("confirm-registration")
    async confirmRegistration(@Body() { confirmationToken }: ConfirmRegistrationDto, @Res() response: Response) {
        try {
            const { accessToken, refreshToken } = await this.authService.confirmRegistration(confirmationToken);
            response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, this.getRefreshTokenCookieOptions());
            return response.send({ accessToken });
        } catch (err) {
            ifError(err).is(EntityAlreadyExistsError).throw(new ConflictException()).elseRethrow();
        }
    }

    @HttpCode(200)
    @Post("refresh")
    async refresh(@Res() response: Response, @Cookies(REFRESH_TOKEN_COOKIE_NAME) token: string) {
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const { accessToken, refreshToken } = await this.authService.useRefreshToken(token);
            response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, this.getRefreshTokenCookieOptions());
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

        const options = this.getRefreshTokenCookieOptions();
        response.cookie(REFRESH_TOKEN_COOKIE_NAME, "", {
            ...options,
            maxAge: 0,
        });

        await this.authService.logout(token);
        return response.send({ success: true });
    }

    private getRefreshTokenCookieOptions(): CookieOptions {
        const maxAge = this.configService.getOrThrow<number>("refreshToken.expirationTimeInSeconds") * 1000;
        return {
            httpOnly: true,
            secure: true,
            partitioned: true,
            sameSite: "strict",
            path: "/auth",
            maxAge,
        };
    }
}
