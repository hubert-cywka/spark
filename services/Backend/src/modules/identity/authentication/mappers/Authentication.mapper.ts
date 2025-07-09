import { plainToInstance } from "class-transformer";

import { AuthenticationResultDto } from "@/modules/identity/authentication/dto/outgoing/AuthenticationResult.dto";
import { OIDCRedirectResponseDto } from "@/modules/identity/authentication/dto/outgoing/OIDCRedirectResponse.dto";
import { IAuthenticationMapper } from "@/modules/identity/authentication/mappers/IAuthentication.mapper";
import { AuthenticationResult } from "@/modules/identity/authentication/types/Authentication";

export class AuthenticationMapper implements IAuthenticationMapper {
    toAuthenticationResultDTO(model: AuthenticationResult): AuthenticationResultDto {
        return plainToInstance(AuthenticationResultDto, {
            account: model.account,
            accessToken: model.accessToken,
            accessScopes: model.accessScopes,
        });
    }

    toOIDCRedirectDTO(url: URL): OIDCRedirectResponseDto {
        return plainToInstance(OIDCRedirectResponseDto, {
            url: url.toString(),
        });
    }
}
