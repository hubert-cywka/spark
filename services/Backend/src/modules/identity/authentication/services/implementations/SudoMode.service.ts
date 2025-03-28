import { Injectable } from "@nestjs/common";

import { type IAuthenticationService } from "@/modules/identity/authentication/services/interfaces/IAuthentication.service";
import { type ISudoModeService } from "@/modules/identity/authentication/services/interfaces/ISudoMode.service";
import { type AuthenticationResult } from "@/modules/identity/authentication/types/Authentication";
import { type ExternalIdentity } from "@/modules/identity/authentication/types/OpenIDConnect";

@Injectable()
export class SudoModeService implements ISudoModeService {
    constructor(private authenticationService: IAuthenticationService) {}

    public async enableWithCredentials(email: string, password: string): Promise<AuthenticationResult> {
        const result = await this.authenticationService.loginWithCredentials(email, password);
        return { ...result, account: { ...result.account, sudoMode: true } };
    }

    public async enableWithExternalIdentity(identity: ExternalIdentity): Promise<AuthenticationResult> {
        const result = await this.authenticationService.loginWithExternalIdentity(identity);
        return { ...result, account: { ...result.account, sudoMode: true } };
    }
}
