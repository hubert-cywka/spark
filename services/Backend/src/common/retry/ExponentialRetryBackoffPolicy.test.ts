import { ExponentialRetryBackoffPolicy } from "@/common/retry/ExponentialRetryBackoffPolicy";

describe("ExponentialRetryBackoffPolicy", () => {
    const baseInterval = 10_000;
    let policy: ExponentialRetryBackoffPolicy;

    beforeEach(() => {
        policy = new ExponentialRetryBackoffPolicy(baseInterval);
    });

    describe("getNextAttemptDelayInMs", () => {
        const delayTestCases = [
            [0, 10_000],
            [1, 20_000],
            [2, 40_000],
            [3, 80_000],
            [5, 320_000],
            [7, 1_280_000],
        ];

        it.each(delayTestCases)("should return %p ms delay for attempt %p", (attempt, expectedDelay) => {
            expect(policy.getNextAttemptDelayInMs(attempt)).toBe(expectedDelay);
        });
    });
});
