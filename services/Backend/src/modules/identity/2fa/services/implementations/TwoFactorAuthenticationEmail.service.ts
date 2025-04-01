import { Inject, Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

import { TwoFactorAuthenticationBaseService } from "@/modules/identity/2fa/services/implementations/TwoFactorAuthenticationBase.service";
import { type ITwoFactorAuthenticationService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthentication.service";
import {
    type ITwoFactorAuthenticationPublisherService,
    TwoFactorAuthenticationPublisherServiceToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationPublisher.service";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";
import { type User } from "@/types/User";

@Injectable()
export class TwoFactorAuthenticationEmailService extends TwoFactorAuthenticationBaseService implements ITwoFactorAuthenticationService {
    constructor(
        @InjectTransactionHost(IDENTITY_MODULE_DATA_SOURCE)
        txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(TwoFactorAuthenticationPublisherServiceToken)
        private readonly publisher: ITwoFactorAuthenticationPublisherService
    ) {
        super(txHost);
    }

    protected canIssueCode(): boolean {
        return true;
    }

    protected async onCodeIssued(user: User, code: string): Promise<void> {
        await this.publisher.onEmail2FACodeIssued(user.id, {
            email: user.email,
            code,
        });
    }

    protected get2FAMethod(): TwoFactorAuthenticationMethod {
        return TwoFactorAuthenticationMethod.EMAIL;
    }

    protected getTOTPTimeToLive(): number {
        return 60 * 3;
    }
}
