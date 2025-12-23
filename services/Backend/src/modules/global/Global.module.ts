import { Global, Module } from "@nestjs/common";

import { DeferredActionDeduplicator } from "@/common/services/implementations/DeferredActionDeduplicator";
import { DomainVerifier } from "@/common/services/implementations/DomainVerifier";
import { ActionDeduplicatorToken } from "@/common/services/interfaces/IActionDeduplicator";
import { DomainVerifierToken } from "@/common/services/interfaces/IDomainVerifier";

@Global()
@Module({
    providers: [
        {
            provide: DomainVerifierToken,
            useClass: DomainVerifier,
        },
        {
            provide: ActionDeduplicatorToken,
            useClass: DeferredActionDeduplicator,
        },
    ],
    exports: [DomainVerifierToken, ActionDeduplicatorToken],
})
export class GlobalModule {}
