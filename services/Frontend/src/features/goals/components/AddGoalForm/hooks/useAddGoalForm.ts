import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export type AddGoalFormInputs = {
    name: string;
    target: number;
    deadline?: Date;
};

export const DEFAULT_TARGET_VALUE = 10;

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 60;

export const useAddGoalForm = (initialValue?: AddGoalFormInputs) => {
    const t = useTranslate();

    const requirements = useMemo(
        () =>
            yup.object({
                name: yup
                    .string()
                    .required(
                        t("goals.forms.add.fields.name.errors.minLength", {
                            length: NAME_MIN_LENGTH,
                        })
                    )
                    .min(
                        NAME_MIN_LENGTH,
                        t("goals.forms.add.fields.name.errors.minLength", {
                            length: NAME_MIN_LENGTH,
                        })
                    )
                    .max(
                        NAME_MIN_LENGTH,
                        t("goals.forms.add.fields.name.errors.maxLength", {
                            length: NAME_MAX_LENGTH,
                        })
                    ),
                target: yup.number().required(t("goals.forms.add.fields.target.errors.required")),
                deadline: yup.date(),
            }),
        [t]
    );

    return useForm<AddGoalFormInputs>({
        resolver: yupResolver<AddGoalFormInputs>(requirements),
        defaultValues: { target: DEFAULT_TARGET_VALUE, ...initialValue },
    });
};
