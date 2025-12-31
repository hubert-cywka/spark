import { Global, Module } from "@nestjs/common";

import { ChecksumCalculator } from "@/common/services/implementations/ChecksumCalculator";
import { CsvParser } from "@/common/services/implementations/CsvParser";
import { DeferredActionDeduplicator } from "@/common/services/implementations/DeferredActionDeduplicator";
import { DomainVerifier } from "@/common/services/implementations/DomainVerifier";
import { ActionDeduplicatorToken } from "@/common/services/interfaces/IActionDeduplicator";
import { ChecksumCalculatorToken } from "@/common/services/interfaces/IChecksumCalculator";
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
        {
            provide: ChecksumCalculatorToken,
            useClass: ChecksumCalculator,
        },
    ],
    exports: [DomainVerifierToken, ActionDeduplicatorToken, CsvParserToken, ChecksumCalculatorToken],
})
export class GlobalModule {}
