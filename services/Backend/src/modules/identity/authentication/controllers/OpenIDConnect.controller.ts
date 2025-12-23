import { CookieSerializeOptions } from "@fastify/cookie";
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
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import { OAuth2RequestError } from "arctic";
import { type FastifyReply } from "fastify";

import { Cookie } from "@/common/decorators/Cookie.decorator";
import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";
import { ForbiddenError } from "@/common/errors/Forbidden.error";
import { whenError } from "@/common/errors/whenError";
import { type IDomainVerifier, DomainVerifierToken } from "@/common/services/interfaces/IDomainVerifier";
import {
    OIDC_CODE_VERIFIER_COOKIE_NAME,
    OIDC_EXTERNAL_IDENTITY,
    OIDC_STATE_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME,
} from "@/modules/identity/authentication/constants";
import { ExternalIdentityDto } from "@/modules/identity/authentication/dto/incoming/ExternalIdentity.dto";
import { RegisterViaOIDCDto } from "@/modules/identity/authentication/dto/incoming/RegisterViaOIDC.dto";
import { UntrustedDomainError } from "@/modules/identity/authentication/errors/UntrustedDomain.error";
import { type IAuthenticationMapper, AuthenticationMapperToken } from "@/modules/identity/authentication/mappers/IAuthentication.mapper";
import {
    type IAuthenticationService,
    AuthenticationServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IAuthenticationService";
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
import { IDENTITY_MODULE_DEFAULT_RATE_LIMITING, IDENTITY_MODULE_STRICT_RATE_LIMITING } from "@/modules/identity/shared/constants";

@Throttle(IDENTITY_MODULE_DEFAULT_RATE_LIMITING)
@Controller("open-id-connect")
export class OpenIDConnectController {
    private readonly refreshTokenCookieMaxAge: number;
    private readonly oidcCookieMaxAge: number;

    public constructor(
        @Inject(DomainVerifierToken)
        private readonly domainVerifier: IDomainVerifier,
        @Inject(OIDCProviderFactoryToken)
        private readonly oidcProviderFactory: IOIDCProviderFactory,
        @Inject(AuthenticationMapperToken)
        private readonly authenticationMapper: IAuthenticationMapper,
        @Inject(RefreshTokenCookieStrategyToken)
        private readonly refreshTokenCookieStrategy: IRefreshTokenCookieStrategy,
        @Inject(AuthenticationServiceToken)
        private readonly authService: IAuthenticationService,
        configService: ConfigService
    ) {
        this.refreshTokenCookieMaxAge = configService.getOrThrow<number>("modules.identity.refreshToken.expirationTimeInSeconds") * 1000;
        this.oidcCookieMaxAge = configService.getOrThrow<number>("modules.identity.oidc.cookie.expirationTimeInSeconds") * 1000;
    }

    @HttpCode(HttpStatus.OK)
    @Get("login/:providerId")
    @Throttle(IDENTITY_MODULE_STRICT_RATE_LIMITING)
    async login(
        @Res() response: FastifyReply,
        @Param("providerId", new ParseEnumPipe(FederatedAccountProvider))
        providerId: FederatedAccountProvider,
        @Query("loginRedirectUrl") loginRedirectUrl: string,
        @Query("registerRedirectUrl") registerRedirectUrl: string
    ) {
        if (!this.domainVerifier.verify(registerRedirectUrl)) {
            throw new UntrustedDomainError(registerRedirectUrl);
        }

        if (!this.domainVerifier.verify(registerRedirectUrl)) {
            throw new UntrustedDomainError(registerRedirectUrl);
        }

        const provider = this.oidcProviderFactory.create(providerId);
        const { codeVerifier, url, state } = provider.startAuthorizationProcess({
            loginRedirectUrl: loginRedirectUrl,
            registerRedirectUrl: registerRedirectUrl,
        });

        response.setCookie(OIDC_CODE_VERIFIER_COOKIE_NAME, codeVerifier, this.getOIDCCookieOptions());
        response.setCookie(OIDC_STATE_COOKIE_NAME, state, this.getOIDCCookieOptions());
        return response.send(this.authenticationMapper.toOIDCRedirectDTO(url));
    }

    @HttpCode(HttpStatus.OK)
    @Get("login/:providerId/callback")
    @SkipThrottle()
    async loginCallback(
        @Res() response: FastifyReply,
        @Param("providerId", new ParseEnumPipe(FederatedAccountProvider))
        providerId: FederatedAccountProvider,
        @Query("code") code: string,
        @Query("state") state: string,
        @Cookie(OIDC_STATE_COOKIE_NAME) storedState: string,
        @Cookie(OIDC_CODE_VERIFIER_COOKIE_NAME) storedCodeVerifier: string
    ) {
        const provider = this.oidcProviderFactory.create(providerId);
        const decodedState = provider.validateAuthorizationResponse({
            code,
            state,
            storedCodeVerifier,
            storedState,
        });

        if (!decodedState) {
            throw new BadRequestException();
        }

        const { registerRedirectUrl } = decodedState;
        const loginRedirectUrl = new URL(decodedState.loginRedirectUrl);

        let externalIdentity: ExternalIdentity | null = null;

        try {
            externalIdentity = await provider.getIdentity(code, storedCodeVerifier);
            response.setCookie(OIDC_EXTERNAL_IDENTITY, JSON.stringify(externalIdentity), this.getExternalIdentityCookieOptions());

            const { accessToken, refreshToken, account, accessScopes } = await this.authService.loginWithExternalIdentity(externalIdentity);
            const cookieOptions = this.refreshTokenCookieStrategy.getCookieOptions(this.refreshTokenCookieMaxAge);

            response.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieOptions);
            loginRedirectUrl.searchParams.set("accessToken", accessToken);
            loginRedirectUrl.searchParams.set("accessScopes", encodeURIComponent(JSON.stringify(accessScopes)));
            loginRedirectUrl.searchParams.set("account", encodeURIComponent(JSON.stringify(account)));
        } catch (err) {
            if (err instanceof EntityNotFoundError && !!externalIdentity) {
                return response.status(HttpStatus.FOUND).redirect(registerRedirectUrl);
            }

            if (err instanceof ForbiddenError && !!externalIdentity) {
                loginRedirectUrl.searchParams.set("error", "ACCOUNT_SUSPENDED");
            } else {
                loginRedirectUrl.searchParams.set("error", "UNKNOWN");
            }
        }

        return response.status(HttpStatus.FOUND).redirect(loginRedirectUrl.toString());
    }

    @HttpCode(HttpStatus.CREATED)
    @Post("register")
    @Throttle(IDENTITY_MODULE_STRICT_RATE_LIMITING)
    async registerWithOIDC(
        @Res() response: FastifyReply,
        @Body() _dto: RegisterViaOIDCDto,
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

            response.setCookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, cookieOptions);
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

    private getOIDCCookieOptions(): CookieSerializeOptions {
        return {
            partitioned: true,
            httpOnly: true,
            secure: true,
            maxAge: this.oidcCookieMaxAge,
            sameSite: "lax",
            path: "/",
        };
    }

    private getExternalIdentityCookieOptions(): CookieSerializeOptions {
        return {
            partitioned: true,
            httpOnly: true,
            secure: true,
            maxAge: this.oidcCookieMaxAge,
            sameSite: "strict",
            path: "/api/open-id-connect/register",
            signed: true,
        };
    }
}
