import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    InternalServerErrorException,
    Post,
    Query,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuth2RequestError } from "arctic";
import { type CookieOptions, type Response } from "express";

import { Cookies } from "@/common/decorators/Cookie.decorator";
import { DataCorruptionError } from "@/common/errors/DataCorruption.error";
import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { ForbiddenError } from "@/common/errors/Forbidden.error";
import { whenError } from "@/common/errors/whenError";
import {
    OIDC_CODE_VERIFIER_COOKIE_NAME,
    OIDC_GOOGLE_EXTERNAL_IDENTITY,
    OIDC_STATE_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME,
} from "@/modules/identity/authentication/constants";
import type { LoginDto } from "@/modules/identity/authentication/dto/Login.dto";
import type { RegisterViaOIDCDto } from "@/modules/identity/authentication/dto/RegisterViaOIDC.dto";
import type { RegisterWithCredentialsDto } from "@/modules/identity/authentication/dto/RegisterWithCredentials.dto";
import {
    type IAuthenticationService,
    IAuthenticationServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import {
    type IGoogleOIDCProviderService,
    IGoogleOIDCProviderServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IGoogleOIDCProvider.service";
import { AccountProvider } from "@/modules/identity/authentication/types/AccountProvider";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

@Controller("api/auth")
export class AuthenticationController {
    private readonly refreshTokenCookieMaxAge: number;

    constructor(
        @Inject(IGoogleOIDCProviderServiceToken)
        private googleOIDCProvider: IGoogleOIDCProviderService,
        @Inject(IAuthenticationServiceToken)
        private authService: IAuthenticationService,
        private configService: ConfigService
    ) {
        this.refreshTokenCookieMaxAge = configService.getOrThrow<number>("modules.auth.refreshToken.expirationTimeInSeconds") * 1000;
    }

    @HttpCode(HttpStatus.CREATED)
    @Post("register")
    async registerWithCredentials(@Body() dto: RegisterWithCredentialsDto) {
        try {
            return await this.authService.registerWithCredentials(dto);
        } catch (err) {
            whenError(err).is(EntityConflictError).throw(new ConflictException()).elseRethrow();
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    async login(@Body() dto: LoginDto, @Res() response: Response) {
        try {
            const { accessToken, refreshToken, account } = await this.authService.loginWithCredentials(dto);
            this.setRefreshToken(response, refreshToken);
            return response.send({ ...account, accessToken });
        } catch (err) {
            whenError(err)
                .is(EntityNotFoundError)
                .throw(new UnauthorizedException())
                .is(ForbiddenError)
                .throw(new ForbiddenException())
                .is(DataCorruptionError)
                .throw(new InternalServerErrorException())
                .elseRethrow();
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post("refresh")
    async refresh(@Res() response: Response, @Cookies(REFRESH_TOKEN_COOKIE_NAME) token: string) {
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const { accessToken, refreshToken, account } = await this.authService.redeemRefreshToken(token);
            this.setRefreshToken(response, refreshToken);
            return response.send({ ...account, accessToken });
        } catch (err) {
            whenError(err).is(EntityNotFoundError).throw(new UnauthorizedException()).elseRethrow();
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post("logout")
    async logout(@Res() response: Response, @Cookies(REFRESH_TOKEN_COOKIE_NAME) token: string) {
        if (!token) {
            throw new UnauthorizedException();
        }

        await this.authService.logout(token);
        this.clearRefreshToken(response);
        return response.send();
    }

    @HttpCode(HttpStatus.FOUND)
    @Get("login/google")
    async loginWithGoogle(@Res() response: Response) {
        const { url, state, codeVerifier } = this.googleOIDCProvider.startAuthorizationProcess();
        response.cookie(OIDC_CODE_VERIFIER_COOKIE_NAME, codeVerifier, this.getOIDCCookieOptions());
        response.cookie(OIDC_STATE_COOKIE_NAME, state, this.getOIDCCookieOptions());
        return response.redirect(url.toString());
    }

    @HttpCode(HttpStatus.OK)
    @Get("login/google/callback")
    async loginWithGoogleCallback(
        @Res() response: Response,
        @Query("code") code: string,
        @Query("state") state: string,
        @Cookies(OIDC_STATE_COOKIE_NAME) storedState: string,
        @Cookies(OIDC_CODE_VERIFIER_COOKIE_NAME) storedCodeVerifier: string
    ) {
        if (
            !this.googleOIDCProvider.validateAuthorizationResponse({
                code,
                state,
                storedCodeVerifier,
                storedState,
            })
        ) {
            throw new BadRequestException();
        }

        // TODO: OIDC
        const redirectUrl = new URL("https://honest-champion-lioness.ngrok-free.app/");

        try {
            const externalIdentity = await this.googleOIDCProvider.getIdentity(code, storedCodeVerifier);
            response.cookie(OIDC_GOOGLE_EXTERNAL_IDENTITY, JSON.stringify(externalIdentity), this.getOIDCCookieOptions());

            const { accessToken, refreshToken, account } = await this.authService.loginWithExternalIdentity(
                externalIdentity,
                AccountProvider.GOOGLE
            );

            this.setRefreshToken(response, refreshToken);
            redirectUrl.searchParams.set("accessToken", accessToken);
            redirectUrl.searchParams.set("account", encodeURIComponent(JSON.stringify(account)));
        } catch (err) {
            redirectUrl.searchParams.set("error", "1");

            if (err instanceof EntityNotFoundError) {
                redirectUrl.searchParams.set("askForRegistration", "1");
            }
        }

        return response.redirect(redirectUrl.toString());
    }

    @HttpCode(HttpStatus.CREATED)
    @Post("register/google")
    async registerWithGoogle(
        @Res() response: Response,
        @Body() dto: RegisterViaOIDCDto,
        @Cookies(OIDC_GOOGLE_EXTERNAL_IDENTITY) externalIdentityString: string
    ) {
        if (!externalIdentityString || !dto.hasAcceptedTermsAndConditions) {
            throw new BadRequestException();
        }

        const externalIdentity: ExternalIdentity = JSON.parse(externalIdentityString);

        if (this.googleOIDCProvider.validateExternalIdentity(externalIdentity)) {
            throw new UnauthorizedException();
        }

        try {
            const { accessToken, refreshToken, account } = await this.authService.registerWithExternalIdentity(
                externalIdentity,
                AccountProvider.GOOGLE
            );

            this.setRefreshToken(response, refreshToken);
            return response.send({ ...account, accessToken });
        } catch (err) {
            whenError(err)
                .is(OAuth2RequestError)
                .throw(new UnauthorizedException())
                .is(EntityConflictError)
                .throw(new ConflictException())
                .elseRethrow();
        }
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

    private getOIDCCookieOptions(): CookieOptions {
        return {
            partitioned: true,
            httpOnly: true,
            secure: true,
            maxAge: 60 * 10 * 1000,
            sameSite: "lax",
            path: "/",
        };
    }
}
