import { useMutation } from "@tanstack/react-query";

import { AlertsService } from "@/features/alerts/api/alertsService";
import { Alert } from "@/features/alerts/types/Alert";
import { AlertsQueryKeyFactory } from "@/features/alerts/utils/alertsQueryKeyFactory";
import { useQueryCache } from "@/hooks/useQueryCache";

const queryKey = AlertsQueryKeyFactory.createForAll();

export const useDeleteAlert = () => {
    const { update, revert } = useQueryCache();

    return useMutation({
        mutationFn: AlertsService.deleteOne,
        onMutate: async (id) => {
            return await update<Alert[]>(queryKey, (alerts) => {
                return alerts.filter((alert) => alert.id !== id);
            });
        },
        onError: (_error, _variables, context) => {
            revert(context);
        },
    });
};
