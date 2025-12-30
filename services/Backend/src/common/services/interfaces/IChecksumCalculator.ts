export const ChecksumCalculatorToken = Symbol("ChecksumCalculator");

export interface IChecksumCalculator {
    fromBlob(data: Blob): Promise<string>;
    fromArrayBuffer(buffer: Buffer<ArrayBufferLike>): Promise<string>;
}
