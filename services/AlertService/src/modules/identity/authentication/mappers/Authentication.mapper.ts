import { plainToClass } from "class-transformer";

import { AuthenticationResultDto } from "@/modules/identity/authentication/dto/outcoming/AuthenticationResult.dto";
import { OIDCRedirectResponseDto } from "@/modules/identity/authentication/dto/outcoming/OIDCRedirectResponse.dto";
import { IAuthenticationMapper } from "@/modules/identity/authentication/mappers/IAuthentication.mapper";
import { AuthenticationResult } from "@/modules/identity/authentication/types/Authentication";

export class AuthenticationMapper implements IAuthenticationMapper {
    toAuthenticationResultDTO(model: AuthenticationResult): AuthenticationResultDto {
        return plainToClass(AuthenticationResultDto, {
            account: model.account,
            accessToken: model.accessToken,
        });
    }

    toOIDCRedirectDTO(url: URL): OIDCRedirectResponseDto {
        return plainToClass(OIDCRedirectResponseDto, { url: url.toString() });
    }
}
