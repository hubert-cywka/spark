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
import { ForbiddenError } from "@/common/errors/Forbidden.error";
import { whenError } from "@/common/errors/whenError";
import {
    OIDC_CODE_VERIFIER_COOKIE_NAME,
    OIDC_EXTERNAL_IDENTITY,
    OIDC_STATE_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME,
} from "@/modules/identity/authentication/constants";
import { ExternalIdentityDto } from "@/modules/identity/authentication/dto/incoming/ExternalIdentity.dto";
import { RegisterViaOIDCDto } from "@/modules/identity/authentication/dto/incoming/RegisterViaOIDC.dto";
import { type IAuthenticationMapper, AuthenticationMapperToken } from "@/modules/identity/authentication/mappers/IAuthentication.mapper";
import {
    type IAuthenticationService,
    AuthenticationServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import {
    type IOIDCProviderFactory,
    OIDCProviderFactoryToken,
} from "@/modules/identity/authentication/services/interfaces/IOIDCProvider.factory";
import {
    type IRefreshTokenCookieStrategy,
    RefreshTokenCookieStrategyToken,
} from "@/modules/identity/authentication/strategies/refreshToken/IRefreshTokenCookie.strategy";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

@Controller("open-id-connect")
export class OpenIDConnectController {
    private readonly refreshTokenCookieMaxAge: number;
    private readonly clientOIDCLoginPageUrl: string;
    private readonly clientOIDCRegisterPageUrl: string;

    public constructor(
        @Inject(OIDCProviderFactoryToken)
        private readonly oidcProviderFactory: IOIDCProviderFactory,
        @Inject(AuthenticationMapperToken)
        private readonly authenticationMapper: IAuthenticationMapper,
        @Inject(RefreshTokenCookieStrategyToken)
        private readonly refreshTokenCookieStrategy: IRefreshTokenCookieStrategy,
        @Inject(AuthenticationServiceToken)
        private readonly authService: IAuthenticationService,
        private readonly configService: ConfigService
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
        return response.send(this.authenticationMapper.toOIDCRedirectDTO(url));
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

            if (err instanceof ForbiddenError && !!externalIdentity) {
                loginRedirectUrl.searchParams.set("error", "ACCOUNT_SUSPENDED");
            } else {
                loginRedirectUrl.searchParams.set("error", "UNKNOWN");
            }
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
            const result = await this.authService.registerWithExternalIdentity(externalIdentity);
            const cookieOptions = this.refreshTokenCookieStrategy.getCookieOptions(this.refreshTokenCookieMaxAge);

            response.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, cookieOptions);
            return response.send(this.authenticationMapper.toAuthenticationResultDTO(result));
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
            maxAge: 60 * 5 * 1000, // TODO: Make it configurable
            sameSite: "lax",
            path: "/",
        };
    }

    private getExternalIdentityCookieOptions(): CookieOptions {
        return {
            partitioned: true,
            httpOnly: true,
            secure: true,
            maxAge: 60 * 10 * 1000, // TODO: Make it configurable
            sameSite: "strict",
            path: "/api/open-id-connect/register",
            signed: true,
        };
    }
}
