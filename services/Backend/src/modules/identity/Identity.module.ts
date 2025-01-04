import { Module } from "@nestjs/common";

import { IInboxEventHandler, InboxEventHandlersToken } from "@/common/events";
import { AccountModule } from "@/modules/identity/account/Account.module";
import { AuthenticationModule } from "@/modules/identity/authentication/Authentication.module";
import { AccountPasswordUpdatedEventHandler } from "@/modules/identity/authentication/events/AccountPasswordUpdatedEvent.handler";
import { AccessTokenStrategy } from "@/modules/identity/authentication/strategies/passport/AccessToken.strategy";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    providers: [
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [AccessTokenStrategy, AccountPasswordUpdatedEventHandler],
        },
    ],
    imports: [IdentitySharedModule, AccountModule, AuthenticationModule],
    exports: [],
})
export class IdentityModule {}
