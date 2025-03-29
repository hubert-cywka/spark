import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { type IDomainVerifierService } from "@/common/services/IDomainVerifier.service";

// TODO: Use this to verify URLs for password reset and account confirmation.
@Injectable()
export class DomainVerifierService implements IDomainVerifierService {
    private readonly trustedDomains: string[] = [];

    constructor(private readonly configService: ConfigService) {
        this.trustedDomains.push(this.configService.getOrThrow<string>("client.url.base"));
    }

    public verify(...urls: (URL | string)[]): boolean {
        for (const url of urls) {
            let parsedUrl: URL;

            try {
                if (typeof url === "string") {
                    parsedUrl = new URL(url);
                } else {
                    parsedUrl = url;
                }
            } catch {
                return false;
            }

            if (
                !this.trustedDomains.some((domain) => {
                    const domainUrl = new URL(domain);
                    return parsedUrl.hostname === domainUrl.hostname && parsedUrl.protocol === domainUrl.protocol;
                })
            ) {
                return false;
            }
        }
        return true;
    }
}
