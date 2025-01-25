import { useQuery } from "@tanstack/react-query";

import { AlertsService } from "@/features/alerts/api/alertsService";
import { AlertsQueryKeyFactory } from "@/features/alerts/utils/alertsQueryKeyFactory";

export const useAlerts = () => {
    return useQuery({
        queryFn: AlertsService.getAll,
        queryKey: AlertsQueryKeyFactory.createForAll(),
    });
};
