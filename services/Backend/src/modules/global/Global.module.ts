import { Global, Module } from "@nestjs/common";

import { DomainVerifier } from "@/common/services/implementations/DomainVerifier";
import { Throttler } from "@/common/services/implementations/Throttler";
import { DomainVerifierToken } from "@/common/services/interfaces/IDomainVerifier";
import { ThrottlerToken } from "@/common/services/interfaces/IThrottler";

@Global()
@Module({
    providers: [
        {
            provide: DomainVerifierToken,
            useClass: DomainVerifier,
        },
        {
            provide: ThrottlerToken,
            useClass: Throttler,
        },
    ],
    exports: [DomainVerifierToken, ThrottlerToken],
})
export class GlobalModule {}
