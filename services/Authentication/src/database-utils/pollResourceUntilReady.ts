import { Logger } from "@nestjs/common";

type PollingOptions = {
    resourceName: string;
    pollingFn: () => Promise<boolean>;
    maxAttempts?: number;
    intervalInMilliseconds?: number;
};

export async function pollResourceUntilReady({
    resourceName,
    pollingFn,
    maxAttempts = 10,
    intervalInMilliseconds = 5000,
}: PollingOptions) {
    const logger = new Logger(pollResourceUntilReady.name);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            if (await pollingFn()) {
                return;
            }
        } catch (e) {
            logger.warn("Resource is not ready yet.", {
                resource: resourceName,
                attempt,
                maxAttempts,
                intervalInMilliseconds,
            });

            if (attempt < maxAttempts) {
                await new Promise((resolve) => setTimeout(resolve, intervalInMilliseconds));
            } else {
                throw new Error(`Polling for resource: ${resourceName} failed after ${attempt} attempts.`);
            }
        }
    }
}
