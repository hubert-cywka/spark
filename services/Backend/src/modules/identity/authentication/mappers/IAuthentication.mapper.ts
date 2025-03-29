import { AuthenticationResultDto } from "@/modules/identity/authentication/dto/outgoing/AuthenticationResult.dto";
import { OIDCRedirectResponseDto } from "@/modules/identity/authentication/dto/outgoing/OIDCRedirectResponse.dto";
import { AuthenticationResult } from "@/modules/identity/authentication/types/Authentication";

export const AuthenticationMapperToken = Symbol("AuthenticationMapper");

export interface IAuthenticationMapper {
    toAuthenticationResultDTO(model: AuthenticationResult): AuthenticationResultDto;
    toOIDCRedirectDTO(url: URL): OIDCRedirectResponseDto;
}
