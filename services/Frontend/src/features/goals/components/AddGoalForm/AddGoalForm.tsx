"use client";

import styles from "./styles/AddGoalForm.module.scss";

import { Button } from "@/components/Button";
import { Field, NumberInput } from "@/components/Input";
import { DateInput } from "@/components/Input/DateInput";
import { AddGoalFormInputs, DEFAULT_TARGET_VALUE, useAddGoalForm } from "@/features/goals/components/AddGoalForm/hooks/useAddGoalForm";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type AddGoalFormProps = {
    onSubmit: (inputs: AddGoalFormInputs) => void;
    onReset?: () => void;
    initialValue?: AddGoalFormInputs;
    isLoading?: boolean;
};

const MIN_TARGET_VALUE = 1;
const MAX_TARGET_VALUE = 100;

export const AddGoalForm = ({ onSubmit, onReset, isLoading, initialValue }: AddGoalFormProps) => {
    const t = useTranslate();
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useAddGoalForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} onReset={onReset} className={styles.form}>
            <Field
                required
                {...register("name")}
                defaultValue={initialValue?.name}
                label={t("goals.create.form.fields.name.label")}
                error={errors.name?.message}
            />

            <NumberInput
                required
                {...register("target")}
                label={t("goals.create.form.fields.target.label")}
                minValue={MIN_TARGET_VALUE}
                maxValue={MAX_TARGET_VALUE}
                defaultValue={initialValue?.target ?? DEFAULT_TARGET_VALUE}
                error={errors.target?.message}
            />

            <DateInput
                label={t("goals.create.form.fields.deadline.label")}
                control={control}
                name="deadline"
                defaultValue={initialValue?.deadline}
            />

            <div className={styles.buttons}>
                <Button type="reset" variant="secondary">
                    {t("goals.create.form.buttons.cancel.label")}
                </Button>
                <Button type="submit" variant="confirm" isLoading={isLoading}>
                    {t("goals.create.form.buttons.save.label")}
                </Button>
            </div>
        </form>
    );
};
