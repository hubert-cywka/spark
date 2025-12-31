export const ChecksumCalculatorToken = Symbol("ChecksumCalculator");

export interface IChecksumCalculator {
    fromBlob(data: Blob): Promise<string>;
    fromBuffer(buffer: Buffer): Promise<string>;
}
