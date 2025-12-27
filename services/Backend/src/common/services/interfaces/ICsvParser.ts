export const CsvParserToken = Symbol("CsvParserToken");

export interface ICsvParser {
    toCsvBlob(data: object[]): Blob;
}
