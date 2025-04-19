import { type ISingleUseTokenService } from "@/modules/identity/account/services/interfaces/ISingleUseToken.service";
import { type SingleUseTokenType } from "@/modules/identity/account/types/SingleUseToken";

export const SingleUseTokenServiceFactoryToken = Symbol("ISingleUseTokenServiceFactoryToken");

export interface ISingleUseTokenServiceFactory {
    create(variant: SingleUseTokenType): ISingleUseTokenService;
}
