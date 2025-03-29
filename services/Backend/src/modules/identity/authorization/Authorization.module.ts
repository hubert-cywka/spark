import { Module } from "@nestjs/common";

import { AuthorizationController } from "@/modules/identity/authorization/controllers/Authorization.controller";
import { AccessScopesService } from "@/modules/identity/authorization/services/implementations/AccessScopes.service";
import { AccessScopesServiceToken } from "@/modules/identity/authorization/services/interfaces/IAccessScopes.service";
import { AccessTokenStrategy } from "@/modules/identity/authorization/strategies/AccessToken.strategy";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    imports: [IdentitySharedModule],
    providers: [{ provide: AccessScopesServiceToken, useClass: AccessScopesService }, AccessTokenStrategy],
    exports: [AccessTokenStrategy, AccessScopesServiceToken],
    controllers: [AuthorizationController],
})
export class AuthorizationModule {}
