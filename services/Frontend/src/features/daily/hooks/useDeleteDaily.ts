import { useMutation } from "@tanstack/react-query";

import { DailyService } from "@/features/daily/api/dailyService";
import { DailyQueryKeyFactory } from "@/features/daily/utils/dailyQueryKeyFactory";
import { useQueryCache } from "@/hooks/useQueryCache";

const queryKey = DailyQueryKeyFactory.createForAll();

export const useDeleteDaily = () => {
    const { invalidate } = useQueryCache();

    return useMutation({
        mutationFn: DailyService.deleteOne,
        onSuccess: () => invalidate(queryKey),
    });
};
