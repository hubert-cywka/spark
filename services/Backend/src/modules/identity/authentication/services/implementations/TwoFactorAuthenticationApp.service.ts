import { Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

import { TwoFactorAuthenticationBaseService } from "@/modules/identity/authentication/services/implementations/TwoFactorAuthenticationBase.service";
import { type ITwoFactorAuthenticationService } from "@/modules/identity/authentication/services/interfaces/ITwoFactorAuthentication.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/authentication/types/TwoFactorAuthenticationMethod";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { type User } from "@/types/User";

@Injectable()
export class TwoFactorAuthenticationAppService extends TwoFactorAuthenticationBaseService implements ITwoFactorAuthenticationService {
    constructor(
        @InjectTransactionHost(IDENTITY_MODULE_DATA_SOURCE)
        txHost: TransactionHost<TransactionalAdapterTypeOrm>
    ) {
        super(txHost);
    }

    protected canIssueCode(): boolean {
        return false;
    }

    protected onCodeIssued(user: User, code: string): Promise<void> {
        throw new Error(); // TODO: Not supported, code is issued by authenticator app
    }

    protected get2FAMethod(): TwoFactorAuthenticationMethod {
        return TwoFactorAuthenticationMethod.AUTHENTICATOR;
    }

    protected getTOTPTimeToLive(): number {
        return 30;
    }
}
