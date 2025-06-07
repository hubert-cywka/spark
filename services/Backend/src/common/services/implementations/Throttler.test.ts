import { Throttler } from "@/common/services/implementations/Throttler";

describe("Throttler", () => {
    let throttler: Throttler;

    const callback = jest.fn();

    beforeEach(() => {
        throttler = new Throttler();
        jest.resetAllMocks();
        jest.useFakeTimers();
    });

    it("should not execute callback before specified time", () => {
        const callbackId = "id-1";
        const waitTime = 1_000;

        throttler.throttle(callbackId, callback, waitTime);
        jest.advanceTimersByTime(waitTime / 2);

        expect(callback).not.toHaveBeenCalled();
    });

    it("should execute callback after specified time", () => {
        const callbackId = "id-1";
        const waitTime = 1_000;

        throttler.throttle(callbackId, callback, waitTime);
        jest.advanceTimersByTime(waitTime);

        expect(callback).toHaveBeenCalled();
    });

    it("should execute callback only once within given timeframe", () => {
        const callbackId = "id-1";
        const waitTime = 1_000;

        throttler.throttle(callbackId, callback, waitTime);
        throttler.throttle(callbackId, callback, waitTime);
        throttler.throttle(callbackId, callback, waitTime);
        jest.advanceTimersByTime(waitTime);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should not prevent executing callback after given timeframe", () => {
        const callbackId = "id-1";
        const waitTime = 1_000;

        throttler.throttle(callbackId, callback, waitTime);
        jest.advanceTimersByTime(waitTime);

        throttler.throttle(callbackId, callback, waitTime);
        jest.advanceTimersByTime(waitTime);

        expect(callback).toHaveBeenCalledTimes(2);
    });

    it("should not prevent executing callback if different id is used", () => {
        const waitTime = 1_000;

        throttler.throttle("1", callback, waitTime);
        throttler.throttle("2", callback, waitTime);
        throttler.throttle("3", callback, waitTime);
        jest.advanceTimersByTime(waitTime);

        expect(callback).toHaveBeenCalledTimes(3);
    });
});
