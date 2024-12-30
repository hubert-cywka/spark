import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    ParseEnumPipe,
    Post,
    Query,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuth2RequestError } from "arctic";
import { type CookieOptions, type Response } from "express";

import { Cookie } from "@/common/decorators/Cookie.decorator";
import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { whenError } from "@/common/errors/whenError";
import {
    OIDC_CODE_VERIFIER_COOKIE_NAME,
    OIDC_EXTERNAL_IDENTITY,
    OIDC_STATE_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME,
} from "@/modules/identity/authentication/constants";
import { ExternalIdentityDto } from "@/modules/identity/authentication/dto/ExternalIdentity.dto";
import type { RegisterViaOIDCDto } from "@/modules/identity/authentication/dto/RegisterViaOIDC.dto";
import {
    type IAuthenticationService,
    IAuthenticationServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import {
    type IOIDCProviderFactory,
    IOIDCProviderFactoryToken,
} from "@/modules/identity/authentication/services/interfaces/IOIDCProvider.factory";
import {
    type IRefreshTokenCookieStrategy,
    IRefreshTokenCookieStrategyToken,
} from "@/modules/identity/authentication/strategies/refreshToken/IRefreshTokenCookie.strategy";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

@Controller("open-id-connect")
export class OpenIDConnectController {
    private readonly refreshTokenCookieMaxAge: number;
    private readonly clientOIDCLoginPageUrl: string;
    private readonly clientOIDCRegisterPageUrl: string;

    public constructor(
        @Inject(IOIDCProviderFactoryToken)
        private oidcProviderFactory: IOIDCProviderFactory,
        @Inject(IRefreshTokenCookieStrategyToken)
        private refreshTokenCookieStrategy: IRefreshTokenCookieStrategy,
        @Inject(IAuthenticationServiceToken)
        private authService: IAuthenticationService,
        private configService: ConfigService
    ) {
        const oidcLoginPage = configService.getOrThrow<string>("client.url.oidcLoginPage");
        const oidcRegisterPage = configService.getOrThrow<string>("client.url.oidcRegisterPage");
        const clientAppUrl = configService.getOrThrow<string>("client.url.base");

        this.refreshTokenCookieMaxAge = configService.getOrThrow<number>("modules.identity.refreshToken.expirationTimeInSeconds") * 1000;
        this.clientOIDCLoginPageUrl = clientAppUrl.concat(oidcLoginPage);
        this.clientOIDCRegisterPageUrl = clientAppUrl.concat(oidcRegisterPage);
    }

    @HttpCode(HttpStatus.OK)
    @Get("login/:providerId")
    async login(
        @Res() response: Response,
        @Param("providerId", new ParseEnumPipe(FederatedAccountProvider))
        providerId: FederatedAccountProvider
    ) {
        const provider = this.oidcProviderFactory.create(providerId);
        const { url, state, codeVerifier } = provider.startAuthorizationProcess();

        response.cookie(OIDC_CODE_VERIFIER_COOKIE_NAME, codeVerifier, this.getOIDCCookieOptions());
        response.cookie(OIDC_STATE_COOKIE_NAME, state, this.getOIDCCookieOptions());
        return response.send({ url: url.toString() });
    }

    @HttpCode(HttpStatus.OK)
    @Get("login/:providerId/callback")
    async loginCallback(
        @Res() response: Response,
        @Param("providerId", new ParseEnumPipe(FederatedAccountProvider))
        providerId: FederatedAccountProvider,
        @Query("code") code: string,
        @Query("state") state: string,
        @Cookie(OIDC_STATE_COOKIE_NAME) storedState: string,
        @Cookie(OIDC_CODE_VERIFIER_COOKIE_NAME) storedCodeVerifier: string
    ) {
        const provider = this.oidcProviderFactory.create(providerId);
        const isAuthResponseValid = provider.validateAuthorizationResponse({
            code,
            state,
            storedCodeVerifier,
            storedState,
        });

        if (!isAuthResponseValid) {
            throw new BadRequestException();
        }

        const loginRedirectUrl = new URL(this.clientOIDCLoginPageUrl);
        let externalIdentity: ExternalIdentity | null = null;

        try {
            externalIdentity = await provider.getIdentity(code, storedCodeVerifier);
            response.cookie(OIDC_EXTERNAL_IDENTITY, JSON.stringify(externalIdentity), this.getExternalIdentityCookieOptions());

            const { accessToken, refreshToken, account } = await this.authService.loginWithExternalIdentity(externalIdentity);
            const cookieOptions = this.refreshTokenCookieStrategy.getCookieOptions(this.refreshTokenCookieMaxAge);

            response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieOptions);
            loginRedirectUrl.searchParams.set("accessToken", accessToken);
            loginRedirectUrl.searchParams.set("account", encodeURIComponent(JSON.stringify(account)));
        } catch (err) {
            if (err instanceof EntityNotFoundError && !!externalIdentity) {
                return response.redirect(this.clientOIDCRegisterPageUrl);
            }

            loginRedirectUrl.searchParams.set("error", "1"); // TODO: OIDC Notify user about this error
        }

        return response.redirect(loginRedirectUrl.toString());
    }

    @HttpCode(HttpStatus.CREATED)
    @Post("register")
    async registerWithOIDC(
        @Res() response: Response,
        @Body() dto: RegisterViaOIDCDto,
        @Cookie({
            name: OIDC_EXTERNAL_IDENTITY,
            signed: true,
            parseAs: ExternalIdentityDto,
        })
        externalIdentity: ExternalIdentityDto
    ) {
        const provider = this.oidcProviderFactory.create(externalIdentity.providerId);

        if (!provider.validateExternalIdentity(externalIdentity)) {
            throw new UnauthorizedException();
        }

        try {
            const { accessToken, refreshToken, account } = await this.authService.registerWithExternalIdentity(externalIdentity);
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
            maxAge: 60 * 5 * 1000,
            sameSite: "lax",
            path: "/",
        };
    }

    private getExternalIdentityCookieOptions(): CookieOptions {
        return {
            partitioned: true,
            httpOnly: true,
            secure: true,
            maxAge: 60 * 10 * 1000,
            sameSite: "strict",
            path: "/api/open-id-connect/register",
            signed: true,
        };
    }
}
