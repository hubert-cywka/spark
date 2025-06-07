import { Global, Module } from "@nestjs/common";

import { DomainVerifierService } from "@/common/services/implementations/DomainVerifier.service";
import { Throttler } from "@/common/services/implementations/Throttler";
import { DomainVerifierServiceToken } from "@/common/services/interfaces/IDomainVerifier.service";
import { ThrottlerToken } from "@/common/services/interfaces/IThrottler";

@Global()
@Module({
    providers: [
        {
            provide: DomainVerifierServiceToken,
            useClass: DomainVerifierService,
        },
        {
            provide: ThrottlerToken,
            useClass: Throttler,
        },
    ],
    exports: [DomainVerifierServiceToken, ThrottlerToken],
})
export class GlobalModule {}
