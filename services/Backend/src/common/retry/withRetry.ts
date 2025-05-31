import { RetryBackoffPolicy } from "@/common/retry/RetryBackoffPolicy";
import { wait } from "@/common/utils/timeUtils";

export const withRetry = async (
    callback: (attempt?: number) => Promise<void>,
    {
        retryPolicy,
        maxAttempts,
        onSuccess,
        onFailure,
    }: {
        retryPolicy: RetryBackoffPolicy;
        maxAttempts: number;
        onSuccess?: (attempt?: number) => void;
        onFailure?: (error?: unknown, attempt?: number) => void;
    }
) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        if (attempt !== 1) {
            await wait(retryPolicy.getNextAttemptDelayInMs(attempt));
        }

        try {
            await callback(attempt);
            onSuccess?.(attempt);
            break;
        } catch (error) {
            onFailure?.(error, attempt);
        }
    }
};
