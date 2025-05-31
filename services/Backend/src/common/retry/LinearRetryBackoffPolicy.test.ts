import { LinearRetryBackoffPolicy } from "@/common/retry/LinearRetryBackoffPolicy";

describe("LinearRetryBackoffPolicy", () => {
    const baseInterval = 10_000;
    const multiplier = 3;
    let policy: LinearRetryBackoffPolicy;

    beforeEach(() => {
        policy = new LinearRetryBackoffPolicy(baseInterval, multiplier);
    });

    describe("getNextAttemptDelayInMs", () => {
        const delayTestCases = [
            [1, 10_000 * multiplier],
            [2, 20_000 * multiplier],
            [3, 30_000 * multiplier],
        ];

        it.each(delayTestCases)("should return %p ms delay for attempt %p", (attempt, expectedDelay) => {
            expect(policy.getNextAttemptDelayInMs(attempt)).toBe(expectedDelay);
        });
    });
});
