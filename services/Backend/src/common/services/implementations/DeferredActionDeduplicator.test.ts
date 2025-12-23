import { DeferredActionDeduplicator } from "@/common/services/implementations/DeferredActionDeduplicator";

describe("DeferredActionDeduplicator", () => {
    let deduplicator: DeferredActionDeduplicator;

    const callback = jest.fn();

    beforeEach(() => {
        deduplicator = new DeferredActionDeduplicator();
        jest.resetAllMocks();
        jest.useFakeTimers();
    });

    it("should not execute callback before specified time", () => {
        const callbackId = "id-1";
        const waitTime = 1_000;

        deduplicator.run(callbackId, callback, waitTime);
        jest.advanceTimersByTime(waitTime / 2);

        expect(callback).not.toHaveBeenCalled();
    });

    it("should execute callback after specified time", () => {
        const callbackId = "id-1";
        const waitTime = 1_000;

        deduplicator.run(callbackId, callback, waitTime);
        jest.advanceTimersByTime(waitTime);

        expect(callback).toHaveBeenCalled();
    });

    it("should execute callback only once within given timeframe", () => {
        const callbackId = "id-1";
        const waitTime = 1_000;

        deduplicator.run(callbackId, callback, waitTime);
        deduplicator.run(callbackId, callback, waitTime);
        deduplicator.run(callbackId, callback, waitTime);
        jest.advanceTimersByTime(waitTime);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should not prevent executing callback after given timeframe", () => {
        const callbackId = "id-1";
        const waitTime = 1_000;

        deduplicator.run(callbackId, callback, waitTime);
        jest.advanceTimersByTime(waitTime);

        deduplicator.run(callbackId, callback, waitTime);
        jest.advanceTimersByTime(waitTime);

        expect(callback).toHaveBeenCalledTimes(2);
    });

    it("should not prevent executing a callback before the previous one finishes executing", async () => {
        const callbackId = "id-1";
        const waitTime = 1_000;

        let resolveLongRunningCallback: (value: void) => void = (_: unknown) => ({});
        callback.mockImplementationOnce(
            () =>
                new Promise<void>((resolve) => {
                    resolveLongRunningCallback = resolve;
                })
        );

        deduplicator.run(callbackId, callback, waitTime);
        jest.advanceTimersByTime(waitTime);
        deduplicator.run(callbackId, callback, waitTime);
        resolveLongRunningCallback();
        jest.advanceTimersByTime(waitTime);

        expect(callback).toHaveBeenCalledTimes(2);
    });

    it("should not prevent executing callback if different id is used", () => {
        const waitTime = 1_000;

        deduplicator.run("1", callback, waitTime);
        deduplicator.run("2", callback, waitTime);
        deduplicator.run("3", callback, waitTime);
        jest.advanceTimersByTime(waitTime);

        expect(callback).toHaveBeenCalledTimes(3);
    });
});
