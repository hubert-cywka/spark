import { useMutation } from "@tanstack/react-query";

import { DailyService } from "@/features/daily/api/dailyService";

// TODO: Update or invalidate cache
export const useUpdateDailyDate = () => {
    return useMutation({
        mutationFn: DailyService.updateDate,
    });
};
