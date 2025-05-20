import { Global, Module } from "@nestjs/common";

import { DomainVerifierService } from "@/common/services/implementations/DomainVerifier.service";
import { DomainVerifierServiceToken } from "@/common/services/interfaces/IDomainVerifier.service";

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
