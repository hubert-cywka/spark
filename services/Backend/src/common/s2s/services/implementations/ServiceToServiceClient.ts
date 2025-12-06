import fetch from "node-fetch";

import { ServiceRequestFailedError } from "../../errors/ServiceRequestFailed.error";

import { type IServiceToServiceClient } from "@/common/s2s/services/interfaces/IServiceToServiceClient";
import { type ServiceToServiceProxyOptions } from "@/common/s2s/types/ServiceToServiceProxyOptions";

export class ServiceToServiceClient implements IServiceToServiceClient {
    public constructor(private readonly options: ServiceToServiceProxyOptions) {}

    public async get<T>(service: string, endpoint: string): Promise<T> {
        const sanitizedEndpoint = this.stripLeadingSlash(endpoint);
        const url = `${this.options.host}:${this.options.port}/${service}/${sanitizedEndpoint}`;

        const headers = {
            "Content-Type": "application/json",
        };

        const response = await fetch(url, { method: "GET", headers: headers });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new ServiceRequestFailedError(`Request ${service}/${sanitizedEndpoint} has failed. Reason: ${errorBody}`);
        }

        return (await response.json()) as T;
    }

    private stripLeadingSlash(str: string): string {
        if (str.startsWith("/")) {
            return str.substring(1);
        }
        return str;
    }
}
