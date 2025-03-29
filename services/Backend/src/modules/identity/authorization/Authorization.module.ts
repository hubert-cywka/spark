import { Module } from "@nestjs/common";

import { AuthenticationModule } from "@/modules/identity/authentication/Authentication.module";
import { AuthorizationController } from "@/modules/identity/authorization/controllers/Authorization.controller";
import { AuthorizationService } from "@/modules/identity/authorization/services/implementations/Authorization.service";
import { AuthorizationServiceToken } from "@/modules/identity/authorization/services/interfaces/IAuthorization.service";
import { AccessTokenStrategy } from "@/modules/identity/authorization/strategies/AccessToken.strategy";
import { SudoModeStrategy } from "@/modules/identity/authorization/strategies/SudoMode.strategy";
import { IdentitySharedModule } from "@/modules/identity/shared/IdentityShared.module";

@Module({
    imports: [IdentitySharedModule, AuthenticationModule],
    providers: [{ provide: AuthorizationServiceToken, useClass: AuthorizationService }, AccessTokenStrategy, SudoModeStrategy],
    exports: [AccessTokenStrategy, SudoModeStrategy],
    controllers: [AuthorizationController],
})
export class AuthorizationModule {}
