import {fromHours, fromMinutes, fromSeconds} from "@/common/utils/timeUtils";

describe("timeUtils", () => {
    describe("seconds", () => {
        it("should return input converted to milliseconds", () => {
            const result = fromSeconds(10);
            expect(result).toBe(1000 * 10);
        });
    });

    describe("minutes", () => {
        it("should return input converted to milliseconds", () => {
            const result = fromMinutes(10);
            expect(result).toBe(60 * 1000 * 10);
        });
    });

    describe("hours", () => {
        it("should return input converted to milliseconds", () => {
            const result = fromHours(10);
            expect(result).toBe(60 * 60 * 1000 * 10);
        });
    });
});
