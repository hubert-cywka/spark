import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { type IDomainVerifier } from "@/common/services/interfaces/IDomainVerifier";

@Injectable()
export class DomainVerifier implements IDomainVerifier {
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

            const isTrusted = this.trustedDomains.some((domain) => {
                const domainUrl = new URL(domain);
                return parsedUrl.hostname === domainUrl.hostname && parsedUrl.protocol === domainUrl.protocol;
            });

            if (!isTrusted) {
                return false;
            }
        }

        return true;
    }
}
