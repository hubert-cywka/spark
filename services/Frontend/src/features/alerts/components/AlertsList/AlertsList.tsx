"use client";

import styles from "./styles/AlertsList.module.scss";

import { ReminderCard } from "@/features/alerts/components/ReminderCard/ReminderCard";
import { useAlerts } from "@/features/alerts/hooks/useAlerts";
import { useDeleteAlert } from "@/features/alerts/hooks/useDeleteAlert";
import { useDeleteAlertEvents } from "@/features/alerts/hooks/useDeleteAlertEvents";
import { useUpdateAlertEvents } from "@/features/alerts/hooks/useUpdateAlertEvents";
import { useUpdateAlertStatus } from "@/features/alerts/hooks/useUpdateAlertStatus";
import { useUpdateAlertTime } from "@/features/alerts/hooks/useUpdateAlertTime";
import { Day } from "@/types/Day";

export const AlertsList = () => {
    const { data } = useAlerts();

    const { mutateAsync: updateStatus } = useUpdateAlertStatus();
    const { mutateAsync: updateTime } = useUpdateAlertTime();
    const { onUpdateAlertError } = useUpdateAlertEvents();

    const handleUpdateStatus = async (id: string, enabled: boolean) => {
        try {
            await updateStatus({ id, enabled });
        } catch (err) {
            onUpdateAlertError(err);
        }
    };

    const handleUpdateTime = async (id: string, time: string, daysOfWeek: Day[]) => {
        try {
            await updateTime({ id, time, daysOfWeek });
        } catch (err) {
            onUpdateAlertError(err);
        }
    };

    const { mutateAsync: deleteAlert } = useDeleteAlert();
    const { onDeleteAlertError, onDeleteAlertSuccess } = useDeleteAlertEvents();

    const handleDeleteAlert = async (id: string) => {
        try {
            await deleteAlert(id);
            onDeleteAlertSuccess();
        } catch (err) {
            onDeleteAlertError(err);
        }
    };

    return (
        <div className={styles.container}>
            {data?.map((alert) => (
                <ReminderCard
                    key={alert.id}
                    alert={alert}
                    onUpdateTime={(value) => handleUpdateTime(alert.id, value, alert.daysOfWeek)}
                    onUpdateDays={(value) => handleUpdateTime(alert.id, alert.time, value)}
                    onUpdateStatus={(value) => handleUpdateStatus(alert.id, value)}
                    onDelete={() => handleDeleteAlert(alert.id)}
                />
            ))}
        </div>
    );
};
