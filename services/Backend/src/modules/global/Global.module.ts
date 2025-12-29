import { Global, Module } from "@nestjs/common";

import { ChecksumCalculator } from "@/common/services/implementations/ChecksumCalculator";
import { CsvParser } from "@/common/services/implementations/CsvParser";
import { DeferredActionDeduplicator } from "@/common/services/implementations/DeferredActionDeduplicator";
import { DomainVerifier } from "@/common/services/implementations/DomainVerifier";
import { LocalFileService } from "@/common/services/implementations/FileService";
import { ActionDeduplicatorToken } from "@/common/services/interfaces/IActionDeduplicator";
import { ChecksumCalculatorToken } from "@/common/services/interfaces/IChecksumCalculator";
import { CsvParserToken } from "@/common/services/interfaces/ICsvParser";
import { DomainVerifierToken } from "@/common/services/interfaces/IDomainVerifier";
import { FileServiceToken } from "@/common/services/interfaces/IFileService";

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
        {
            provide: FileServiceToken,
            useClass: LocalFileService,
        },
    ],
    exports: [DomainVerifierToken, ActionDeduplicatorToken, CsvParserToken, ChecksumCalculatorToken, FileServiceToken],
})
export class GlobalModule {}
