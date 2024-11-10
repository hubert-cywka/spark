import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Post,
    Query,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuth2RequestError } from "arctic";
import { type CookieOptions, type Response } from "express";

import { Cookies } from "@/common/decorators/Cookie.decorator";
import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import {
    OIDC_CODE_VERIFIER_COOKIE_NAME,
    OIDC_GOOGLE_EXTERNAL_IDENTITY,
    OIDC_STATE_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME,
} from "@/modules/identity/authentication/constants";
import type { RegisterViaOIDCDto } from "@/modules/identity/authentication/dto/RegisterViaOIDC.dto";
import {
    type IAuthenticationService,
    IAuthenticationServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import {
    type IGoogleOIDCProviderService,
    IGoogleOIDCProviderServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IGoogleOIDCProvider.service";
import {
    type IRefreshTokenCookieStrategy,
    IRefreshTokenCookieStrategyToken,
} from "@/modules/identity/authentication/strategies/refreshToken/IRefreshTokenCookie.strategy";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

@Controller("oauth")
export class OpenIDConnectController {
    private readonly refreshTokenCookieMaxAge: number;

    public constructor(
        @Inject(IGoogleOIDCProviderServiceToken)
        private googleOIDCProvider: IGoogleOIDCProviderService,
        @Inject(IRefreshTokenCookieStrategyToken)
        private refreshTokenCookieStrategy: IRefreshTokenCookieStrategy,
        @Inject(IAuthenticationServiceToken)
        private authService: IAuthenticationService,
        private configService: ConfigService
    ) {
        this.refreshTokenCookieMaxAge = configService.getOrThrow<number>("modules.auth.refreshToken.expirationTimeInSeconds") * 1000;
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
                FederatedAccountProvider.GOOGLE
            );

            const cookieOptions = this.refreshTokenCookieStrategy.getCookieOptions(this.refreshTokenCookieMaxAge);
            response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieOptions);

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
                FederatedAccountProvider.GOOGLE
            );

            const cookieOptions = this.refreshTokenCookieStrategy.getCookieOptions(this.refreshTokenCookieMaxAge);
            response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieOptions);
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
