import { Global, Module } from "@nestjs/common";

import { CsvParser } from "@/common/services/implementations/CsvParser";
import { DeferredActionDeduplicator } from "@/common/services/implementations/DeferredActionDeduplicator";
import { DomainVerifier } from "@/common/services/implementations/DomainVerifier";
import { ActionDeduplicatorToken } from "@/common/services/interfaces/IActionDeduplicator";
import { CsvParserToken } from "@/common/services/interfaces/ICsvParser";
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
        {
            provide: CsvParserToken,
            useClass: CsvParser,
        },
    ],
    exports: [DomainVerifierToken, ActionDeduplicatorToken, CsvParserToken],
})
export class GlobalModule {}
