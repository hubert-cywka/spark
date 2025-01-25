import { Day } from "@/types/Day";

const ALL_WEEKDAYS: Day[] = [Day.SUNDAY, Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY, Day.SATURDAY];

interface TimeWithDays {
    time: string;
    daysOfWeek: Day[];
}

export function convertLocalDataToUTC(data: TimeWithDays): TimeWithDays {
    const { time, daysOfWeek } = data;
    const dayOffset = checkLocalToUTCDayShift(time);

    const utcTime = convertLocalTimeToUTC(time);
    const utcDaysOfWeek = daysOfWeek.map((day) => offsetDay(day, dayOffset));

    return {
        time: utcTime,
        daysOfWeek: utcDaysOfWeek,
    };
}

export function convertUTCDataToLocal(data: TimeWithDays): TimeWithDays {
    const { time, daysOfWeek } = data;
    const dayOffset = checkUTCToLocalDayShift(time);

    const localTime = convertUTCToLocalTime(time);
    const localDaysOfWeek = daysOfWeek.map((day) => offsetDay(day, dayOffset));

    return {
        time: localTime,
        daysOfWeek: localDaysOfWeek,
    };
}

function convertLocalTimeToUTC(time: string): string {
    const [hour, minute, second] = time.split(":").map(Number);

    const localDate = new Date();
    localDate.setHours(hour, minute, second, 0);

    const utcHour = localDate.getUTCHours();
    const utcMinute = localDate.getUTCMinutes();
    const utcSecond = localDate.getUTCSeconds();

    return `${utcHour.toString().padStart(2, "0")}:${utcMinute.toString().padStart(2, "0")}:${utcSecond.toString().padStart(2, "0")}`;
}

function convertUTCToLocalTime(time: string): string {
    const [hour, minute, second] = time.split(":").map(Number);

    const utcDate = new Date();
    utcDate.setUTCHours(hour, minute, second, 0);

    const localHour = utcDate.getHours();
    const localMinute = utcDate.getMinutes();
    const localSecond = utcDate.getSeconds();

    return `${localHour.toString().padStart(2, "0")}:${localMinute.toString().padStart(2, "0")}:${localSecond.toString().padStart(2, "0")}`;
}

function checkLocalToUTCDayShift(localTime: string): number {
    const [localHour, localMinute, localSecond] = localTime.split(":").map(Number);

    const localDate = new Date();
    localDate.setHours(localHour, localMinute, localSecond, 0);

    const utcDate = new Date(localDate.toUTCString());

    const localDay = localDate.getDate();
    const utcDay = utcDate.getUTCDate();

    if (utcDay < localDay) {
        return -1;
    } else if (utcDay === localDay) {
        return 0;
    } else {
        return 1;
    }
}

function checkUTCToLocalDayShift(utcTime: string): number {
    const [utcHour, utcMinute, utcSecond] = utcTime.split(":").map(Number);

    const utcDate = new Date();
    utcDate.setUTCHours(utcHour, utcMinute, utcSecond, 0);

    const offsetInMinutes = utcDate.getTimezoneOffset();

    const localDate = new Date(utcDate.getTime() - offsetInMinutes * 60 * 1000);

    const utcDay = utcDate.getUTCDate();
    const localDay = localDate.getDate();

    if (localDay < utcDay) {
        return -1;
    } else if (localDay === utcDay) {
        return 0;
    } else {
        return 1;
    }
}

function offsetDay(day: Day, offset: number): Day {
    const indexOfDay = ALL_WEEKDAYS.indexOf(day);

    if (indexOfDay === -1) {
        throw new Error("Invalid day.");
    }

    const offsetIndexOfDay = indexOfDay + offset;
    const normalizedIndexOfDay = ((offsetIndexOfDay % ALL_WEEKDAYS.length) + ALL_WEEKDAYS.length) % ALL_WEEKDAYS.length;
    return ALL_WEEKDAYS[normalizedIndexOfDay];
}
