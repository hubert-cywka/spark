"use client";

import { ReactNode } from "react";

import styles from "./styles/AlertsList.module.scss";

import { AddAlertRenderProps, AlertRenderProps } from "@/features/alerts/components/AlertsList/types/AlertsList";
import { useAlerts } from "@/features/alerts/hooks/useAlerts";
import { useDeleteAlert } from "@/features/alerts/hooks/useDeleteAlert";
import { useDeleteAlertEvents } from "@/features/alerts/hooks/useDeleteAlertEvents";
import { useUpdateAlertEvents } from "@/features/alerts/hooks/useUpdateAlertEvents";
import { useUpdateAlertStatus } from "@/features/alerts/hooks/useUpdateAlertStatus";
import { useUpdateAlertTime } from "@/features/alerts/hooks/useUpdateAlertTime";
import { Day } from "@/types/Day";

type AlertsListProps = {
    maxAlertsAllowed: number;
    onAddAlertRender?: (props: AddAlertRenderProps) => ReactNode;
    onAlertRender: (props: AlertRenderProps) => ReactNode;
};

export const AlertsList = ({ maxAlertsAllowed, onAlertRender, onAddAlertRender }: AlertsListProps) => {
    const { data, isLoading } = useAlerts();
    const numberOfAlerts = data?.length ?? 0;

    const { mutateAsync: updateStatus } = useUpdateAlertStatus();
    const { mutateAsync: updateTime } = useUpdateAlertTime();
    const { onUpdateAlertError } = useUpdateAlertEvents();

    const { mutateAsync: deleteAlert } = useDeleteAlert();
    const { onDeleteAlertError, onDeleteAlertSuccess } = useDeleteAlertEvents();

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

    const handleDeleteAlert = async (id: string) => {
        try {
            await deleteAlert(id);
            onDeleteAlertSuccess();
        } catch (err) {
            onDeleteAlertError(err);
        }
    };

    return (
        <ul className={styles.container}>
            {data?.map((alert) =>
                onAlertRender({
                    alert,
                    onUpdateTime: (value) => handleUpdateTime(alert.id, value, alert.daysOfWeek),
                    onUpdateDays: (value) => handleUpdateTime(alert.id, alert.time, value),
                    onUpdateStatus: (value) => handleUpdateStatus(alert.id, value),
                    onDelete: () => handleDeleteAlert(alert.id),
                })
            )}

            {onAddAlertRender?.({
                isDisabled: isLoading || numberOfAlerts >= maxAlertsAllowed,
            })}
        </ul>
    );
};
