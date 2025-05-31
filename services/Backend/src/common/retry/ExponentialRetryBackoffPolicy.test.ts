import { ExponentialRetryBackoffPolicy } from "@/common/retry/ExponentialRetryBackoffPolicy";

describe("ExponentialRetryBackoffPolicy", () => {
    const baseInterval = 10_000;
    let policy: ExponentialRetryBackoffPolicy;

    beforeEach(() => {
        policy = new ExponentialRetryBackoffPolicy(baseInterval);
    });

    describe("getNextAttemptDelayInMs", () => {
        const delayTestCases = [
            [1, 10_000],
            [2, 20_000],
            [3, 40_000],
            [4, 80_000],
            [6, 320_000],
            [8, 1_280_000],
        ];

        it.each(delayTestCases)("should return %p ms delay for attempt %p", (attempt, expectedDelay) => {
            expect(policy.getNextAttemptDelayInMs(attempt)).toBe(expectedDelay);
        });
    });
});
