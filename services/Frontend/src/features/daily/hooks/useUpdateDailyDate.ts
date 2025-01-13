import { useMutation } from "@tanstack/react-query";

import { DailyService } from "@/features/daily/api/dailyService";

export const useUpdateDailyDate = () => {
    return useMutation({
        mutationFn: DailyService.updateDate,
    });
};
