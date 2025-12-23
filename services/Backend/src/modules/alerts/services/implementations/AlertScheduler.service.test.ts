import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc.js";

import { AlertScheduler } from "./AlertScheduler";

import { UTCDay } from "@/modules/alerts/types/UTCDay";

dayjs.extend(utc);

const TUESDAY_DATE = "2025-10-28";
const TUESDAY_10_AM = `${TUESDAY_DATE}T10:00:00Z`;
const SATURDAY_DATE = "2025-11-01";
const SATURDAY_10_AM = `${SATURDAY_DATE}T10:00:00Z`;

describe("AlertScheduler", () => {
    let scheduler: AlertScheduler;
    let mockDate: Dayjs;

    const formatDate = (date: Date | null): string | null => {
        if (!date) {
            return null;
        }

        return dayjs(date).format("YYYY-MM-DD HH:mm:ss.SSS");
    };

    beforeEach(() => {
        scheduler = new AlertScheduler();
    });

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    const setSystemTime = (dateString: string) => {
        mockDate = dayjs(dateString).utc();
        jest.setSystemTime(mockDate.toDate());
    };

    const getExpectedDate = (dateString: string, time: string, daysToAdd: number): Date => {
        const [hour, minute, second] = time.split(":").map(Number);
        return dayjs(dateString)
            .utc()
            .add(daysToAdd, "day")
            .set("hour", hour)
            .set("minute", minute)
            .set("second", second)
            .set("millisecond", 0)
            .toDate();
    };

    describe("scheduleNextTrigger", () => {
        it("should return today's date if the time is in the future today (day=0)", () => {
            setSystemTime(TUESDAY_10_AM);
            const daysOfWeek: UTCDay[] = [2, 3];
            const time = "11:30:00";

            const result = scheduler.scheduleNextTrigger(time, daysOfWeek);
            const expected = getExpectedDate(TUESDAY_10_AM, time, 0);

            expect(formatDate(result)).toEqual(formatDate(expected));
        });

        it("should skip today and find the next match if the time is in the past today (day=0)", () => {
            setSystemTime(TUESDAY_10_AM);
            const daysOfWeek: UTCDay[] = [2];
            const time = "09:00:00";

            const result = scheduler.scheduleNextTrigger(time, daysOfWeek);
            const expected = getExpectedDate(TUESDAY_10_AM, time, 7);

            expect(formatDate(result)).toEqual(formatDate(expected));
        });

        it("should find the next day if today's time is past and the next day is in the list", () => {
            setSystemTime(TUESDAY_10_AM);
            const daysOfWeek: UTCDay[] = [2, 3];
            const time = "09:30:00";

            const result = scheduler.scheduleNextTrigger(time, daysOfWeek);
            const expected = getExpectedDate(TUESDAY_10_AM, time, 1);

            expect(formatDate(result)).toEqual(formatDate(expected));
        });

        it("should skip non-matching days and find a match a few days out", () => {
            setSystemTime(TUESDAY_10_AM);
            const daysOfWeek: UTCDay[] = [4];
            const time = "09:00:00";

            const result = scheduler.scheduleNextTrigger(time, daysOfWeek);
            const expected = getExpectedDate(TUESDAY_10_AM, time, 2);

            expect(formatDate(result)).toEqual(formatDate(expected));
        });

        it("should find the next occurrence in the next calendar week (wrapping around Sunday/Monday)", () => {
            setSystemTime(SATURDAY_10_AM);
            const daysOfWeek: UTCDay[] = [2];
            const time = "11:00:00";

            const result = scheduler.scheduleNextTrigger(time, daysOfWeek);
            const expected = getExpectedDate(SATURDAY_10_AM, time, 3);

            expect(formatDate(result)).toEqual(formatDate(expected));
        });
    });
});
