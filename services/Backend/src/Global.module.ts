import { Global, Module } from "@nestjs/common";

import { DomainVerifierService } from "@/common/services/DomainVerifier.service";
import { DomainVerifierServiceToken } from "@/common/services/IDomainVerifier.service";

@Global()
@Module({
    providers: [
        {
            provide: DomainVerifierServiceToken,
            useClass: DomainVerifierService,
        },
    ],
    exports: [DomainVerifierServiceToken],
})
export class GlobalModule {}
