import { ConfigService } from "@nestjs/config";

import { DomainVerifierService } from "./DomainVerifier.service";

describe("DomainVerifierService", () => {
    let domainVerifierService: DomainVerifierService;
    let configService: ConfigService;

    const trustedBaseUrl = "https://trusted.com";

    beforeEach(() => {
        // @ts-expect-error: No need to mock all properties
        configService = {
            getOrThrow: jest.fn().mockReturnValue(trustedBaseUrl),
        };
        domainVerifierService = new DomainVerifierService(configService);
    });

    it("should return true for a trusted URL string", () => {
        const url = `${trustedBaseUrl}/path`;
        expect(domainVerifierService.verify(url)).toBe(true);
    });

    it("should return true for a trusted URL object", () => {
        const url = new URL(`${trustedBaseUrl}/path`);
        expect(domainVerifierService.verify(url)).toBe(true);
    });

    it("should return true for multiple trusted URLs", () => {
        const url1 = `${trustedBaseUrl}/path1`;
        const url2 = new URL(`${trustedBaseUrl}/path2`);
        expect(domainVerifierService.verify(url1, url2)).toBe(true);
    });

    it("should return false for a URL with a different hostname", () => {
        const url = new URL(`${trustedBaseUrl}/path`);
        url.hostname = "untrusted";
        expect(domainVerifierService.verify(url)).toBe(false);
    });

    it("should return false for a URL with a different protocol but same hostname", () => {
        const url = new URL(`${trustedBaseUrl}/path`);
        url.protocol = "http:";
        expect(domainVerifierService.verify(url)).toBe(false);
    });

    it("should return false for multiple URLs if one is untrusted", () => {
        const trustedUrl = new URL(`${trustedBaseUrl}/path`);
        const untrustedUrl = new URL(trustedBaseUrl);
        untrustedUrl.hostname = "untrusted";
        expect(domainVerifierService.verify(trustedUrl, untrustedUrl)).toBe(false);
    });

    it("should return false for an invalid URL string", () => {
        const invalidUrl = "invalid-url";
        expect(domainVerifierService.verify(invalidUrl)).toBe(false);
    });

    it("should return true for an empty list of URLs", () => {
        expect(domainVerifierService.verify()).toBe(true);
    });
});
