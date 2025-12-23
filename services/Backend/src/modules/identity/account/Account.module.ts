import { Module } from "@nestjs/common";

import { AccountController } from "@/modules/identity/account/controllers/Account.controller";
import { AccountRemovalRequestedEventHandler } from "@/modules/identity/account/events/AccountRemovalRequestedEvent.handler";
import { AccountRemovedEventHandler } from "@/modules/identity/account/events/AccountRemovedEvent.handler";
import { AccountModuleFacade } from "@/modules/identity/account/facade/AccountModule.facade";
import { AccountModuleFacadeToken } from "@/modules/identity/account/facade/IAccountModule.facade";
import { AccountMapper } from "@/modules/identity/account/mappers/Account.mapper";
import { AccountMapperToken } from "@/modules/identity/account/mappers/IAccount.mapper";
import { AccountEventsPublisher } from "@/modules/identity/account/services/implementations/AccountEventsPublisher";
import { AccountRemovalService } from "@/modules/identity/account/services/implementations/AccountRemovalService";
import { FederatedAccountService } from "@/modules/identity/account/services/implementations/FederatedAccountService";
import { ManagedAccountService } from "@/modules/identity/account/services/implementations/ManagedAccountService";
import { SingleUseTokenServiceFactory } from "@/modules/identity/account/services/implementations/SingleUseTokenService.factory";
import { AccountEventsPublisherToken } from "@/modules/identity/account/services/interfaces/IAccountEventsPublisher";
import { AccountRemovalServiceToken } from "@/modules/identity/account/services/interfaces/IAccountRemovalService";
import { FederatedAccountServiceToken } from "@/modules/identity/account/services/interfaces/IFederatedAccountService";
import { ManagedAccountServiceToken } from "@/modules/identity/account/services/interfaces/IManagedAccountService";
import { SingleUseTokenServiceFactoryToken } from "@/modules/identity/account/services/interfaces/ISingelUseTokenService.factory";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    imports: [IdentitySharedModule],
    providers: [
        {
            provide: AccountModuleFacadeToken,
            useClass: AccountModuleFacade,
        },
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
            provide: AccountEventsPublisherToken,
            useClass: AccountEventsPublisher,
        },
        {
            provide: AccountRemovalServiceToken,
            useClass: AccountRemovalService,
        },
        AccountRemovedEventHandler,
        AccountRemovalRequestedEventHandler,
    ],
    controllers: [AccountController],
    exports: [AccountModuleFacadeToken, AccountRemovedEventHandler, AccountRemovalRequestedEventHandler],
})
export class AccountModule {}
