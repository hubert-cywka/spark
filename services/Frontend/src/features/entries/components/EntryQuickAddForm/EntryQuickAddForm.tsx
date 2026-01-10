import { useCallback } from "react";
import classNames from "clsx";
import dayjs from "dayjs";
import { RotateCcwIcon, SendHorizonalIcon } from "lucide-react";

import styles from "./styles/EntryQuickAddForm.module.scss";

import { IconButton } from "@/components/IconButton";
import { DatePicker, Field } from "@/components/Input";
import { EntryQuickAddInputs, useEntryQuickAddForm } from "@/features/entries/components/EntryQuickAddForm/hooks/useEntryQuickAddForm.ts";
import { Entry } from "@/features/entries/types/Entry";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { ISODateString } from "@/types/ISODateString";

type EntryQuickAddFormProps = {
    onCreateEntry: (values: Pick<Entry, "content" | "date" | "isFeatured" | "isCompleted">) => Promise<Entry | undefined>;
    defaultDate: ISODateString;
};

export const EntryQuickAddForm = ({ onCreateEntry, defaultDate }: EntryQuickAddFormProps) => {
    const t = useTranslate();
    const { handleSubmit, register, watch, resetField, setValue, resetDate } = useEntryQuickAddForm({ defaultDate });

    const contentValue = watch("content");
    const dateValue = watch("date");
    const isDefaultDate = dateValue === defaultDate;
    const isDateFromFuture = dayjs(dateValue).isAfter(dayjs());

    const internalOnSubmit = useCallback(
        async (data: EntryQuickAddInputs) => {
            const entry = await onCreateEntry({
                date: data.date,
                content: data.content.trim(),
                isCompleted: false,
                isFeatured: false,
            });

            if (entry) {
                resetField("content");
            }
        },
        [onCreateEntry, resetField]
    );

    return (
        <form onSubmit={handleSubmit(internalOnSubmit)} className={styles.form}>
            <div className={styles.inputContainer}>
                <Field
                    size="3"
                    {...register("content")}
                    placeholder={t(`entries.create.quickAddForm.input.placeholder.${isDateFromFuture ? "future" : "past"}`, {
                        date: dateValue,
                    })}
                    className={styles.contentInput}
                />

                <div className={styles.inputActions}>
                    <IconButton
                        size="2"
                        aria-label={t("entries.create.quickAddForm.submitButton.label")}
                        variant="subtle"
                        type="submit"
                        className={classNames(styles.inputAction)}
                        isDisabled={!contentValue?.trim()}
                        iconSlot={SendHorizonalIcon}
                    />
                </div>
            </div>

            <div className={styles.formActions}>
                <DatePicker
                    size="3"
                    className={styles.formAction}
                    label={t("entries.create.quickAddForm.datePicker.label")}
                    value={dateValue}
                    onChange={(value) => setValue("date", value)}
                    minimal
                />

                <IconButton
                    size="3"
                    className={classNames(styles.formAction, styles.reset, { [styles.hidden]: isDefaultDate })}
                    isDisabled={isDefaultDate}
                    aria-label={t("common.datePicker.resetButton.label")}
                    tooltip={t("common.datePicker.resetButton.label")}
                    iconSlot={RotateCcwIcon}
                    onClick={resetDate}
                />
            </div>
        </form>
    );
};
