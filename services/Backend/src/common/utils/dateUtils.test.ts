import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

import {isOutsideDateRange} from "@/common/utils/dateUtils";
import {ISODateString, ISODateStringRange} from "@/types/Date";

describe("dateUtils", () => {
    
    beforeAll(() => {
        dayjs.extend(utc);
        dayjs.extend(timezone);
    })
    
    const getISODateString = (offsetDays: number): ISODateString => {
        return dayjs().utc().add(offsetDays, "day").format("YYYY-MM-DD") as ISODateString;
    }
    
    describe("isOutsideDateRange", () => {
        it("should return true when the current date is before the range", () => {
            const range: ISODateStringRange = {
                from: getISODateString(-2),
                to: getISODateString(-1),
            };
            
            const result = isOutsideDateRange(range);
            
            expect(result).toBe(true);
        })

        it("should return true when the current date is after the range", () => {
            const range: ISODateStringRange = {
                from: getISODateString(1),
                to: getISODateString(2),
            };

            const result = isOutsideDateRange(range);

            expect(result).toBe(true);
        })

        it("should return false when the current date is inside the range", () => {
            const range: ISODateStringRange = {
                from: getISODateString(-1),
                to: getISODateString(1),
            };

            const result = isOutsideDateRange(range);

            expect(result).toBe(false);
        })
    })
});
