import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useHookFormAdapter } from "@/hooks/useHookFormAdapter.ts";
import { ISODateString } from "@/types/ISODateString";

export type EntryQuickAddInputs = {
    content: string;
    date: ISODateString;
};

export const useEntryQuickAddForm = ({ defaultDate }: { defaultDate: ISODateString }) => {
    const schema = useMemo(
        () =>
            yup.object({
                content: yup.string().trim().required(),
                date: yup.string().required() as yup.Schema<ISODateString>,
            }),
        []
    );

    const adapter = useHookFormAdapter<EntryQuickAddInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            content: "",
            date: defaultDate,
        },
    });

    const resetDate = () => adapter.setValue("date", defaultDate);

    return {
        ...adapter,
        resetDate,
    };
};
