import { SingleUseTokenRedeemData } from "@/modules/identity/account/types/SingleUseToken";

export const ISingleUseTokenServiceToken = Symbol("ISingleUseTokenServiceToken");

export interface ISingleUseTokenService {
    issueAccountActivationToken(ownerId: string): Promise<string>;
    redeemAccountActivationToken(token: string): Promise<SingleUseTokenRedeemData>;
    invalidateAllAccountActivationTokens(ownerId: string): Promise<void>;

    issuePasswordChangeToken(ownerId: string): Promise<string>;
    redeemPasswordChangeToken(token: string): Promise<SingleUseTokenRedeemData>;
    invalidateAllPasswordChangeTokens(ownerId: string): Promise<void>;
}
