"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { AddAlertRenderProps } from "@/features/alerts/components/AlertsList/types/AlertsList";
import { useCreateAlert } from "@/features/alerts/hooks/useCreateAlert";
import { useCreateAlertEvents } from "@/features/alerts/hooks/useCreateAlertEvents";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { Day } from "@/types/Day";

const DEFAULT_TIME = "17:00:00";
const DEFAULT_DAYS = [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY];

export const AddDefaultReminderButton = ({ isDisabled }: AddAlertRenderProps) => {
    const { mutateAsync: createAlert, isPending } = useCreateAlert();
    const { onCreateAlertError, onCreateAlertSuccess } = useCreateAlertEvents();
    const t = useTranslate();

    const handleCreateReminder = async () => {
        try {
            await createAlert({ time: DEFAULT_TIME, daysOfWeek: DEFAULT_DAYS });
            onCreateAlertSuccess();
        } catch (err) {
            onCreateAlertError(err);
        }
    };

    return (
        <Button
            variant="confirm"
            rightDecorator={<Icon slot={Plus} />}
            onPress={handleCreateReminder}
            isLoading={isPending}
            isDisabled={isDisabled}
        >
            {t("alerts.reminders.addButton.label")}
        </Button>
    );
};
