import { Module } from "@nestjs/common";

import { AccountController } from "@/modules/identity/account/controllers/Account.controller";
import { AccountPublisherService } from "@/modules/identity/account/services/implementations/AccountPublisher.service";
import { FederatedAccountService } from "@/modules/identity/account/services/implementations/FederatedAccount.service";
import { ManagedAccountService } from "@/modules/identity/account/services/implementations/ManagedAccount.service";
import { SingleUseTokenService } from "@/modules/identity/account/services/implementations/SingleUseToken.service";
import { IAccountPublisherServiceToken } from "@/modules/identity/account/services/interfaces/IAccountPublisher.service";
import { IFederatedAccountServiceToken } from "@/modules/identity/account/services/interfaces/IFederatedAccount.service";
import { IManagedAccountServiceToken } from "@/modules/identity/account/services/interfaces/IManagedAccount.service";
import { ISingleUseTokenServiceToken } from "@/modules/identity/account/services/interfaces/ISingleUseToken.service";

@Module({
    imports: [],
    providers: [
        {
            provide: ISingleUseTokenServiceToken,
            useClass: SingleUseTokenService,
        },
        {
            provide: IManagedAccountServiceToken,
            useClass: ManagedAccountService,
        },
        {
            provide: IFederatedAccountServiceToken,
            useClass: FederatedAccountService,
        },
        {
            provide: IAccountPublisherServiceToken,
            useClass: AccountPublisherService,
        },
    ],
    controllers: [AccountController],
    exports: [IAccountPublisherServiceToken, IFederatedAccountServiceToken, IManagedAccountServiceToken, ISingleUseTokenServiceToken],
})
export class AccountModule {}
