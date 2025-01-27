import { type LoggerService } from "@nestjs/common";

type PollingOptions = {
    resourceName: string;
    pollingFn: (attempt: number) => Promise<boolean>;
    maxAttempts?: number;
    intervalInMilliseconds?: number;
};

export async function pollResource(
    { resourceName, pollingFn, maxAttempts = 10, intervalInMilliseconds = 5000 }: PollingOptions,
    logger?: LoggerService
) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            if (await pollingFn(attempt)) {
                return;
            }
        } catch (err) {
            logger?.warn("Can't connect to resource yet.", {
                attempt,
                err,
            });

            if (attempt < maxAttempts) {
                await new Promise((resolve) => setTimeout(resolve, intervalInMilliseconds));
            } else {
                throw new Error(`Polling for resource: ${resourceName} failed after ${attempt} attempts.`);
            }
        }
    }
}
