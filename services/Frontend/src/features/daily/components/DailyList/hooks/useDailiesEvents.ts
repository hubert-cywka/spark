import { QueryKey } from "@tanstack/react-query";
import dayjs from "dayjs";

import { useCreateDaily } from "@/features/daily/hooks/useCreateDaily";
import { useCreateDailyEvents } from "@/features/daily/hooks/useCreateDailyEvents";
import { useUpdateDailyDate } from "@/features/daily/hooks/useUpdateDailyDate";
import { useUpdateDailyDateEvents } from "@/features/daily/hooks/useUpdateDailyDateEvents";
import { formatToISODateString } from "@/features/daily/utils/dateUtils";
import { ISODateString } from "@/types/ISODateString";

type UseDailiesEvents = {
    queryKey: QueryKey;
    endDate: Date;
    startDate: Date;
};

export const useDailiesEvents = ({ queryKey, endDate, startDate }: UseDailiesEvents) => {
    const { mutateAsync: createDaily } = useCreateDaily({ queryKey });
    const { onCreateDailyError, onCreateDailySuccess } = useCreateDailyEvents();

    const { mutateAsync: updateDate } = useUpdateDailyDate();
    const { onUpdateDailyDateError, onUpdateDailyDateSuccess } = useUpdateDailyDateEvents();

    const onUpdateDailyDate = async (id: string, date: ISODateString) => {
        try {
            await updateDate({ id, date });
            onUpdateDailyDateSuccess();
        } catch (err) {
            onUpdateDailyDateError(err);
        }
    };

    const onCreateNewDaily = async () => {
        let newDailyDate = dayjs();

        if (!newDailyDate.isBefore(endDate) || !newDailyDate.isAfter(startDate)) {
            newDailyDate = dayjs(startDate);
        }

        try {
            await createDaily({
                date: formatToISODateString(newDailyDate.toDate()),
            });
            onCreateDailySuccess();
        } catch (err) {
            onCreateDailyError(err);
        }
    };

    return { onCreateNewDaily, onUpdateDailyDate };
};
