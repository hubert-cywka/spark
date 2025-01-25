import { useMutation } from "@tanstack/react-query";

import { AlertsService } from "@/features/alerts/api/alertsService";
import { Alert } from "@/features/alerts/types/Alert";
import { AlertsQueryKeyFactory } from "@/features/alerts/utils/alertsQueryKeyFactory";
import { useQueryCache } from "@/hooks/useQueryCache";

const queryKey = AlertsQueryKeyFactory.createForAll();

export const useUpdateAlertTime = () => {
    const { update, revert } = useQueryCache();

    return useMutation({
        mutationFn: AlertsService.updateTime,
        onMutate: async ({ time, daysOfWeek, id }) => {
            return await update<Alert[]>(queryKey, (alerts) => {
                return alerts.map((alert) => (alert.id === id ? { ...alert, daysOfWeek, time } : alert));
            });
        },
        onError: (_error, _variables, context) => {
            revert(context);
        },
    });
};
