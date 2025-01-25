"use client";

import { Plus } from "lucide-react";

import { IconButton } from "@/components/IconButton";
import { useCreateAlert } from "@/features/alerts/hooks/useCreateAlert";
import { Day } from "@/types/Day";

const DEFAULT_TIME = "17:00:00";
const DEFAULT_DAYS = [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY];

export const AddDefaultReminderButton = () => {
    const { mutateAsync: createAlert, isPending } = useCreateAlert();
    const handleCreateAlert = async () => {
        await createAlert({ time: DEFAULT_TIME, daysOfWeek: DEFAULT_DAYS });
    };

    return <IconButton variant="confirm" iconSlot={Plus} onPress={handleCreateAlert} isLoading={isPending} size="1" />;
};
