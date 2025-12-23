import { type ISingleUseTokenService } from "@/modules/identity/account/services/interfaces/ISingleUseTokenService";
import { type SingleUseTokenType } from "@/modules/identity/account/types/SingleUseToken";

export const SingleUseTokenServiceFactoryToken = Symbol("ISingleUseTokenServiceFactoryToken");

export interface ISingleUseTokenServiceFactory {
    create(variant: SingleUseTokenType): ISingleUseTokenService;
}
