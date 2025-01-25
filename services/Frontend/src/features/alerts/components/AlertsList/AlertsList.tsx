"use client";

import styles from "./styles/AlertsList.module.scss";

import { ReminderCard } from "@/features/alerts/components/ReminderCard/ReminderCard";
import { useAlerts } from "@/features/alerts/hooks/useAlerts";
import { useDeleteAlert } from "@/features/alerts/hooks/useDeleteAlert";
import { useUpdateAlertStatus } from "@/features/alerts/hooks/useUpdateAlertStatus";
import { useUpdateAlertTime } from "@/features/alerts/hooks/useUpdateAlertTime";
import { Day } from "@/types/Day";

export const AlertsList = () => {
    const { data } = useAlerts();

    const { mutateAsync: updateStatus } = useUpdateAlertStatus();
    const handleUpdateStatus = async (id: string, enabled: boolean) => {
        await updateStatus({ id, enabled });
    };

    const { mutateAsync: updateTime } = useUpdateAlertTime();
    const handleUpdateTime = async (id: string, time: string, daysOfWeek: Day[]) => {
        await updateTime({ id, time, daysOfWeek });
    };

    const { mutateAsync: deleteAlert } = useDeleteAlert();
    const handleDeleteAlert = async (id: string) => {
        await deleteAlert(id);
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
