import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export type AddGoalFormInputs = {
    name: string;
    target: number;
    deadline?: Date;
};

export const useAddGoalForm = () => {
    const requirements = useMemo(
        () =>
            yup.object({
                name: yup.string().required(),
                target: yup.number().required(),
                deadline: yup.date(),
            }),
        []
    );

    return useForm<AddGoalFormInputs>({
        resolver: yupResolver<AddGoalFormInputs>(requirements),
    });
};
