import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useHookFormAdapter } from "@/hooks/useHookFormAdapter.ts";
import { ISODateString } from "@/types/ISODateString";

export type UpdateEntryDateInputs = {
    date: ISODateString;
};

export const useUpdateEntryDateForm = ({ defaultDate }: { defaultDate: ISODateString }) => {
    const schema = useMemo(
        () =>
            yup.object({
                date: yup.string().required() as yup.Schema<ISODateString>,
            }),
        []
    );

    return useHookFormAdapter<UpdateEntryDateInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            date: defaultDate,
        },
    });
};
