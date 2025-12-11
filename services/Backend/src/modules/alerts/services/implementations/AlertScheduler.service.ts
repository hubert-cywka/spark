import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";

import { type IAlertScheduler } from "@/modules/alerts/services/interfaces/IAlertScheduler.service";
import { type UTCDay } from "@/modules/alerts/types/UTCDay";

@Injectable()
export class AlertScheduler implements IAlertScheduler {
    public scheduleNextTrigger(time: string, daysOfWeek: UTCDay[]): Date | null {
        if (!daysOfWeek.length) {
            return null;
        }

        const [hour, minute, second] = time.split(":");
        const timeHour = parseInt(hour, 10);
        const timeMinute = parseInt(minute, 10);
        const timeSecond = parseInt(second, 10);

        const now = dayjs().utc();

        for (let day = 0; day <= 7; day++) {
            let candidateDate = now.add(day, "day");

            candidateDate = candidateDate.set("hour", timeHour).set("minute", timeMinute).set("second", timeSecond).set("millisecond", 0);

            const currentDay = candidateDate.day();
            if (daysOfWeek.includes(currentDay as UTCDay)) {
                if (day === 0) {
                    if (candidateDate.isAfter(now)) {
                        return candidateDate.toDate();
                    }
                    continue;
                }

                return candidateDate.toDate();
            }
        }

        return null;
    }
}
