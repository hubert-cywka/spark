import {
    All,
    Body,
    ConflictException,
    Controller,
    ForbiddenException,
    HttpCode,
    Inject,
    NotFoundException,
    Post,
    Put,
    Res,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SkipThrottle } from "@nestjs/throttler";
import { CookieOptions, Response } from "express";

import { Cookies } from "@/common/decorators/Cookie.decorator";
import { EntityAlreadyExistsError } from "@/common/errors/EntityAlreadyExists.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { ForbiddenError } from "@/common/errors/Forbidden.error";
import { AuthenticationGuard } from "@/common/guards/Authentication.guard";
import { ifError } from "@/common/utils/ifError";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/modules/auth/constants/tokens";
import { LoginDto } from "@/modules/auth/dto/Login.dto";
import { RedeemActivationTokenDto } from "@/modules/auth/dto/RedeemActivationToken.dto";
import { RegisterDto } from "@/modules/auth/dto/Register.dto";
import { RequestActivationTokenDto } from "@/modules/auth/dto/RequestActivationToken.dto";
import { RequestPasswordResetDto } from "@/modules/auth/dto/RequestPasswordReset.dto";
import { UpdatePasswordDto } from "@/modules/auth/dto/UpdatePassword.dto";
import { UserAlreadyActivatedError } from "@/modules/auth/errors/UserAlreadyActivated.error";
import { UserNotFoundError } from "@/modules/auth/errors/UserNotFound.error";
import { IAuthService, IAuthServiceToken } from "@/modules/auth/services/interfaces/IAuth.service";
import { IUserService, IUserServiceToken } from "@/modules/auth/services/interfaces/IUser.service";

@Controller("api/auth")
export class AuthController {
    constructor(
        @Inject(IAuthServiceToken) private authService: IAuthService,
        @Inject(IUserServiceToken) private userService: IUserService,
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
        const maxAge = this.configService.getOrThrow<number>("modules.auth.refreshToken.expirationTimeInSeconds") * 1000;
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

    @Post("password/reset")
    async requestPasswordChange(@Body() { email }: RequestPasswordResetDto) {
        try {
            await this.userService.requestPasswordChange(email);
        } catch (err) {
            // HC: Due to security reasons, do not give any information about the user, as this endpoint is exposed to public.
            // Those errors do not require any handling and the information about them is logged just before they are thrown.
            if (err instanceof UserNotFoundError) {
                return;
            } else {
                throw err;
            }
        }
    }

    @Put("password")
    async updatePassword(@Body() { password, passwordChangeToken }: UpdatePasswordDto) {
        try {
            await this.userService.updatePassword(passwordChangeToken, password);
        } catch (err) {
            ifError(err).is(EntityNotFoundError).throw(new NotFoundException()).elseRethrow();
        }
    }

    @HttpCode(201)
    @Post("/account/activation/redeem")
    async redeemActivationToken(@Body() { activationToken }: RedeemActivationTokenDto) {
        try {
            await this.userService.activate(activationToken);
        } catch (err) {
            ifError(err)
                .is(EntityNotFoundError)
                .throw(new NotFoundException())
                .is(EntityAlreadyExistsError)
                .throw(new ConflictException())
                .elseRethrow();
        }
    }

    @HttpCode(201)
    @Post("/account/activation/request")
    async requestActivationToken(@Body() { email }: RequestActivationTokenDto) {
        try {
            await this.userService.requestActivation(email);
        } catch (err) {
            // HC: Due to security reasons, do not give any information about the user, as this endpoint is exposed to public.
            // Those errors do not require any handling and the information about them is logged just before they are thrown.
            if (err instanceof UserNotFoundError || err instanceof UserAlreadyActivatedError) {
                return;
            } else {
                throw err;
            }
        }
    }
}
