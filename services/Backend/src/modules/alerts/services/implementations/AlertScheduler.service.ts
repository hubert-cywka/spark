import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { type IAlertSchedulerService } from "@/modules/alerts/services/interfaces/IAlertScheduler.service";
import { type UTCDay } from "@/modules/alerts/types/UTCDay";

dayjs.extend(utc);

@Injectable()
export class AlertSchedulerService implements IAlertSchedulerService {
    public findNextTriggerTime(time: string, daysOfWeek: UTCDay[]): Date | null {
        if (!daysOfWeek.length) {
            return null;
        }

        const now = dayjs().utc();
        let nextAlertTime = dayjs().utc();

        const [hour, minute, second] = time.split(":");
        nextAlertTime = nextAlertTime.set("hour", parseInt(hour)).set("minute", parseInt(minute)).set("second", parseInt(second));

        const currentDayOfWeek = now.day();
        const daysLeftInCurrentWeek = daysOfWeek.filter((day) => day >= currentDayOfWeek);

        if (!!daysLeftInCurrentWeek.length && nextAlertTime.isAfter(now)) {
            const daysOffset = Math.min(...daysLeftInCurrentWeek.map(Number)) - currentDayOfWeek;
            nextAlertTime = nextAlertTime.add(daysOffset, "days");
        } else {
            const daysOffset = 7 - (currentDayOfWeek - Math.min(...daysOfWeek.map(Number)));
            nextAlertTime = nextAlertTime.add(daysOffset, "days");
        }

        return nextAlertTime.toDate();
    }
}
