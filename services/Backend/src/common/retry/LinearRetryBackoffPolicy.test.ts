import { LinearRetryBackoffPolicy } from "@/common/retry/LinearRetryBackoffPolicy";

describe("LinearRetryBackoffPolicy", () => {
    const baseInterval = 10_000;
    let policy: LinearRetryBackoffPolicy;

    beforeEach(() => {
        policy = new LinearRetryBackoffPolicy(baseInterval);
    });

    describe("getNextAttemptDelayInMs", () => {
        const delayTestCases = [
            [1, 10_000],
            [2, 20_000],
            [3, 30_000],
        ];

        it.each(delayTestCases)("should return %p ms delay for attempt %p", (attempt, expectedDelay) => {
            expect(policy.getNextAttemptDelayInMs(attempt)).toBe(expectedDelay);
        });
    });
});
