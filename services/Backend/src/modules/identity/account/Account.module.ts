import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { ThrottlingGuard } from "@/common/guards/Throttling.guard";
import { AccountController } from "@/modules/identity/account/controllers/Account.controller";
import { AccountMapper } from "@/modules/identity/account/mappers/Account.mapper";
import { AccountMapperToken } from "@/modules/identity/account/mappers/IAccount.mapper";
import { AccountPublisherService } from "@/modules/identity/account/services/implementations/AccountPublisher.service";
import { FederatedAccountService } from "@/modules/identity/account/services/implementations/FederatedAccount.service";
import { ManagedAccountService } from "@/modules/identity/account/services/implementations/ManagedAccount.service";
import { SingleUseTokenService } from "@/modules/identity/account/services/implementations/SingleUseToken.service";
import { AccountPublisherServiceToken } from "@/modules/identity/account/services/interfaces/IAccountPublisher.service";
import { FederatedAccountServiceToken } from "@/modules/identity/account/services/interfaces/IFederatedAccount.service";
import { ManagedAccountServiceToken } from "@/modules/identity/account/services/interfaces/IManagedAccount.service";
import { SingleUseTokenServiceToken } from "@/modules/identity/account/services/interfaces/ISingleUseToken.service";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    imports: [IdentitySharedModule],
    providers: [
        { provide: APP_GUARD, useClass: ThrottlingGuard },
        {
            provide: SingleUseTokenServiceToken,
            useClass: SingleUseTokenService,
        },
        {
            provide: AccountMapperToken,
            useClass: AccountMapper,
        },
        {
            provide: ManagedAccountServiceToken,
            useClass: ManagedAccountService,
        },
        {
            provide: FederatedAccountServiceToken,
            useClass: FederatedAccountService,
        },
        {
            provide: AccountPublisherServiceToken,
            useClass: AccountPublisherService,
        },
    ],
    controllers: [AccountController],
    exports: [AccountPublisherServiceToken, FederatedAccountServiceToken, ManagedAccountServiceToken, SingleUseTokenServiceToken],
})
export class AccountModule {}
