import { Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

import { IssuingCodesNotSupportedError } from "@/modules/identity/2fa/errors/IssuingCodesNotSupported.error";
import { TwoFactorAuthenticationBaseService } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationBase.service";
import { type ITwoFactorAuthenticationService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthentication.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
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

    protected onCodeIssued(_user: User, _code: string): Promise<void> {
        throw new IssuingCodesNotSupportedError();
    }

    protected get2FAMethod(): TwoFactorAuthenticationMethod {
        return TwoFactorAuthenticationMethod.AUTHENTICATOR;
    }

    protected getTOTPTimeToLive(): number {
        return 30;
    }
}
