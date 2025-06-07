"use client";

import { Trash } from "lucide-react";

import styles from "./styles/ReminderCard.module.scss";

import { Card } from "@/components/Card";
import { IconButton } from "@/components/IconButton";
import { Toggle } from "@/components/Toggle";
import { AlertRenderProps } from "@/features/alerts/components/AlertsList/types/AlertsList";
import { AlertTimeInput } from "@/features/alerts/components/AlertTimeInput/AlertTimeInput";
import { DaysSelect } from "@/features/alerts/components/DaysSelect/DaysSelect";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const ReminderCard = ({ alert, onUpdateStatus, onUpdateTime, onUpdateDays, onDelete }: AlertRenderProps) => {
    const t = useTranslate();

    return (
        <Card as="article" key={alert.id} className={styles.container} variant="translucent">
            <div className={styles.wrapper}>
                <Toggle isSelected={alert.enabled} onChange={onUpdateStatus} size="3" />
                <AlertTimeInput value={alert.time} onChange={onUpdateTime} />
            </div>
            <DaysSelect selected={alert.daysOfWeek} onChange={onUpdateDays} />
            <IconButton
                iconSlot={Trash}
                onPress={onDelete}
                variant="subtle"
                tooltip={t("alerts.reminders.deleteButton.label")}
                aria-label={t("alerts.reminders.deleteButton.label")}
            />
        </Card>
    );
};
