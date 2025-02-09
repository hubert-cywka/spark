"use client";

import { Plus } from "lucide-react";

import { IconButton } from "@/components/IconButton";
import { useCreateAlert } from "@/features/alerts/hooks/useCreateAlert";
import { useCreateAlertEvents } from "@/features/alerts/hooks/useCreateAlertEvents";
import { Day } from "@/types/Day";

const DEFAULT_TIME = "17:00:00";
const DEFAULT_DAYS = [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY];

export const AddDefaultReminderButton = () => {
    const { mutateAsync: createAlert, isPending } = useCreateAlert();
    const { onCreateAlertError, onCreateAlertSuccess } = useCreateAlertEvents();

    const handleCreateAlert = async () => {
        try {
            await createAlert({ time: DEFAULT_TIME, daysOfWeek: DEFAULT_DAYS });
            onCreateAlertSuccess();
        } catch (err) {
            onCreateAlertError(err);
        }
    };

    return <IconButton variant="confirm" iconSlot={Plus} onPress={handleCreateAlert} isLoading={isPending} size="1" />;
};
