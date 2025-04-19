import { Module } from "@nestjs/common";

import { AccountController } from "@/modules/identity/account/controllers/Account.controller";
import { AccountRemovalRequestedEventHandler } from "@/modules/identity/account/events/AccountRemovalRequestedEvent.handler";
import { AccountRemovedEventHandler } from "@/modules/identity/account/events/AccountRemovedEvent.handler";
import { AccountMapper } from "@/modules/identity/account/mappers/Account.mapper";
import { AccountMapperToken } from "@/modules/identity/account/mappers/IAccount.mapper";
import { AccountPublisherService } from "@/modules/identity/account/services/implementations/AccountPublisher.service";
import { AccountRemovalService } from "@/modules/identity/account/services/implementations/AccountRemoval.service";
import { FederatedAccountService } from "@/modules/identity/account/services/implementations/FederatedAccount.service";
import { ManagedAccountService } from "@/modules/identity/account/services/implementations/ManagedAccount.service";
import { SingleUseTokenServiceFactory } from "@/modules/identity/account/services/implementations/SingleUseTokenService.factory";
import { AccountPublisherServiceToken } from "@/modules/identity/account/services/interfaces/IAccountPublisher.service";
import { AccountRemovalServiceToken } from "@/modules/identity/account/services/interfaces/IAccountRemoval.service";
import { FederatedAccountServiceToken } from "@/modules/identity/account/services/interfaces/IFederatedAccount.service";
import { ManagedAccountServiceToken } from "@/modules/identity/account/services/interfaces/IManagedAccount.service";
import { SingleUseTokenServiceFactoryToken } from "@/modules/identity/account/services/interfaces/ISingelUseTokenService.factory";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    imports: [IdentitySharedModule],
    providers: [
        {
            provide: SingleUseTokenServiceFactoryToken,
            useClass: SingleUseTokenServiceFactory,
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
        {
            provide: AccountRemovalServiceToken,
            useClass: AccountRemovalService,
        },
        AccountRemovedEventHandler,
        AccountRemovalRequestedEventHandler,
    ],
    controllers: [AccountController],
    exports: [
        AccountPublisherServiceToken,
        FederatedAccountServiceToken,
        ManagedAccountServiceToken,
        AccountRemovedEventHandler,
        AccountRemovalRequestedEventHandler,
    ],
})
export class AccountModule {}
