"use client";

import { useState } from "react";

import { ReminderCard } from "@/features/alerts/components/reminders";
import { Alert } from "@/features/alerts/types/Alert";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { Day } from "@/types/Day.ts";

const createdAt = new Date("Fri, 01 Jun 2025 15:55:00 GMT");
const nextTriggerAt = new Date("Fri, 01 Jun 2035 15:55:00 GMT");
const time = "15:55:00 GMT";

const mockAlert: Alert = {
    id: "1",
    enabled: true,
    daysOfWeek: [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY],
    nextTriggerAt,
    createdAt,
    time,
};

export const DemoReminderCard = () => {
    const t = useTranslate();
    const [alert, setAlert] = useState<Alert>(mockAlert);

    const handleUpdateStatus = (enabled: boolean) => {
        setAlert((prevAlert) => ({ ...prevAlert, enabled }));
    };

    const handleUpdateTime = (time: string) => {
        setAlert((prevAlert) => ({ ...prevAlert, time }));
    };

    const handleUpdateDays = (daysOfWeek: Day[]) => {
        setAlert((prevAlert) => ({ ...prevAlert, daysOfWeek }));
    };

    return (
        <ReminderCard
            alert={alert}
            translateFn={t}
            onUpdateStatus={handleUpdateStatus}
            onUpdateTime={handleUpdateTime}
            onUpdateDays={handleUpdateDays}
            onDelete={() => ({})}
        />
    );
};
