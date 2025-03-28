import { Module } from "@nestjs/common";

import { AccountController } from "@/modules/identity/account/controllers/Account.controller";
import { AccountRemovalRequestedEventHandler } from "@/modules/identity/account/events/AccountRemovalRequestedEvent.handler";
import { AccountRemovedEventHandler } from "@/modules/identity/account/events/AccountRemovedEvent.handler";
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
        AccountRemovedEventHandler,
        AccountRemovalRequestedEventHandler,
    ],
    controllers: [AccountController],
    exports: [
        AccountPublisherServiceToken,
        FederatedAccountServiceToken,
        ManagedAccountServiceToken,
        SingleUseTokenServiceToken,
        AccountRemovedEventHandler,
        AccountRemovalRequestedEventHandler,
    ],
})
export class AccountModule {}
