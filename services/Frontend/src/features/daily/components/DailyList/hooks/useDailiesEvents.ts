import { QueryKey } from "@tanstack/react-query";
import dayjs from "dayjs";

import { useCreateDaily } from "@/features/daily/hooks/useCreateDaily";
import { useCreateDailyEvents } from "@/features/daily/hooks/useCreateDailyEvents";
import { getFormattedDailyDate } from "@/features/daily/utils/dateUtils";

type UseDailiesEvents = {
    queryKey: QueryKey;
    endDate: Date;
    startDate: Date;
};

export const useDailiesEvents = ({ queryKey, endDate, startDate }: UseDailiesEvents) => {
    const { onCreateDailyError, onCreateDailySuccess } = useCreateDailyEvents();
    const { mutateAsync: createDaily } = useCreateDaily({ queryKey });

    const onCreateNewDaily = async () => {
        let newDailyDate = dayjs();

        if (!newDailyDate.isBefore(endDate) || !newDailyDate.isAfter(startDate)) {
            newDailyDate = dayjs(startDate);
        }

        try {
            await createDaily({
                date: getFormattedDailyDate(newDailyDate.toDate()),
            });
            onCreateDailySuccess();
        } catch (err) {
            onCreateDailyError(err);
        }
    };

    return { onCreateNewDaily };
};
