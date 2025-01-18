import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAdaptedForm } from "@/hooks/useAdaptedForm";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export type AddGoalFormInputs = {
    name: string;
    target: number;
    deadline?: Date;
};

export const DEFAULT_TARGET_VALUE = 10;

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 90;

export const useAddGoalForm = () => {
    const t = useTranslate();

    const requirements = useMemo(
        () =>
            yup.object({
                name: yup
                    .string()
                    .required(
                        t("goals.create.form.fields.name.errors.minLength", {
                            length: NAME_MIN_LENGTH,
                        })
                    )
                    .min(
                        NAME_MIN_LENGTH,
                        t("goals.create.form.fields.name.errors.minLength", {
                            length: NAME_MIN_LENGTH,
                        })
                    )
                    .max(
                        NAME_MAX_LENGTH,
                        t("goals.create.form.fields.name.errors.maxLength", {
                            length: NAME_MAX_LENGTH,
                        })
                    ),
                target: yup.number().required(t("goals.create.form.fields.target.errors.required")),
                deadline: yup.date(),
            }),
        [t]
    );

    return useAdaptedForm<AddGoalFormInputs>({
        resolver: yupResolver<AddGoalFormInputs>(requirements),
        defaultValues: {
            target: DEFAULT_TARGET_VALUE,
        },
    });
};
