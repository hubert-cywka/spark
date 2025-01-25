import { useMutation } from "@tanstack/react-query";

import { AlertsService } from "@/features/alerts/api/alertsService";
import { AlertsQueryKeyFactory } from "@/features/alerts/utils/alertsQueryKeyFactory";
import { useQueryCache } from "@/hooks/useQueryCache";

const queryKey = AlertsQueryKeyFactory.createForAll();

// TODO: Add events (notifications)
export const useCreateAlert = () => {
    const { invalidate } = useQueryCache();

    return useMutation({
        mutationFn: AlertsService.createOne,
        onSuccess: async () => {
            await invalidate(queryKey);
        },
    });
};
