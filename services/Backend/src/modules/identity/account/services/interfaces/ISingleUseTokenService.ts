import type { SingleUseTokenRedeemData } from "@/modules/identity/account/types/SingleUseToken";

export const SingleUseTokenServiceToken = Symbol("ISingleUseTokenServiceToken");

export interface ISingleUseTokenService {
    issue(ownerId: string): Promise<string>;
    redeem(token: string): Promise<SingleUseTokenRedeemData>;
    invalidateAll(ownerId: string): Promise<void>;
}
