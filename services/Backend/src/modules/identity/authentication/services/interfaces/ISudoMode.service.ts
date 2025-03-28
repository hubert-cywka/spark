import type { AuthenticationResult } from "@/modules/identity/authentication/types/Authentication";
import type { ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

export const SudoModeServiceToken = Symbol("SudoModeService");

export interface ISudoModeService {
    enableWithExternalIdentity(identity: ExternalIdentity): Promise<AuthenticationResult>;
    enableWithCredentials(email: string, password: string): Promise<AuthenticationResult>;
}
