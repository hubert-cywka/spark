export const CsvParserToken = Symbol("CsvParserToken");

export interface ICsvParser {
    toBlob(data: object[]): Blob;
    toBuffer(data: object[]): Buffer;
}
