import { AesGcmEncryptionAlgorithm } from "./AesGcmEncryptionAlgorithm";

describe("AesGcmEncryptionAlgorithm", () => {
    let algorithm: AesGcmEncryptionAlgorithm;
    const secretKey = "a".repeat(64);
    const differentSecretKey = "b".repeat(64);

    beforeEach(() => {
        algorithm = new AesGcmEncryptionAlgorithm(secretKey);
    });

    it.each(["hello world", 12345, true, { id: 1, name: "test" }, [1, "two", false], {}, []])(
        "should correctly encrypt and decrypt payload: %s",
        async (payload) => {
            const encrypted = await algorithm.encrypt(payload);
            const decrypted = await algorithm.decrypt<typeof payload>(encrypted);
            expect(decrypted).toEqual(payload);
        }
    );

    it("should throw when decrypting a payload with incorrect number of parts", async () => {
        const invalidPayload = "part1.part2";
        await expect(algorithm.decrypt(invalidPayload)).rejects.toThrow();
    });

    it.each(["part1.part2", "part1", "part1.part2.part3.part4", ".", "..", "..."])(
        "should throw when decrypting an incorrect payload: %s",
        async (payload) => {
            await expect(algorithm.decrypt(payload)).rejects.toThrow();
        }
    );

    it("should throw an error when decrypting tampered data", async () => {
        const payload = { data: "test" };
        const encrypted = await algorithm.encrypt(payload);
        const parts = encrypted.split(".");
        const tamperedEncryptedBase64 = Buffer.from("tampered" + Buffer.from(parts[1], "base64").toString("utf8")).toString("base64");
        const tamperedPayload = `${parts[0]}.${tamperedEncryptedBase64}.${parts[2]}`;

        await expect(algorithm.decrypt(tamperedPayload)).rejects.toThrow();
    });

    it("should throw an error when decrypting with a different key", async () => {
        const payload = { data: "test" };
        const encrypted = await algorithm.encrypt(payload);

        const differentAlgorithm = new AesGcmEncryptionAlgorithm(differentSecretKey);

        await expect(differentAlgorithm.decrypt(encrypted)).rejects.toThrow();
    });
});
