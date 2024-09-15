type PollingOptions = {
    resourceName: string;
    pollingFn: (attempt: number) => Promise<boolean>;
    maxAttempts?: number;
    intervalInMilliseconds?: number;
};

export async function pollResourceUntilReady({
    resourceName,
    pollingFn,
    maxAttempts = 10,
    intervalInMilliseconds = 5000,
}: PollingOptions) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            if (await pollingFn(attempt)) {
                return;
            }
        } catch (e) {
            if (attempt < maxAttempts) {
                await new Promise((resolve) => setTimeout(resolve, intervalInMilliseconds));
            } else {
                throw new Error(`Polling for resource: ${resourceName} failed after ${attempt} attempts.`);
            }
        }
    }
}
