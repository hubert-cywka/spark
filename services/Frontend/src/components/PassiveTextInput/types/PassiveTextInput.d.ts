import { KeyboardEvent } from "react";

import { TranslationFn } from "@/lib/i18n/i18n";

export type PassiveTextInputChildrenProps<T> = {
    value: T | null;
    onChange: (value: T | null) => void;
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
    isDisabled?: boolean;
};

export type PassiveTextInputEditModeActionsRenderProps = {
    onCancelEditMode: () => void;
    onSaveChanges: () => void;
    hasValueChanged: boolean;
    translationFn: TranslationFn;
};

export type PassiveTextInputPassiveModeActionsRenderProps = {
    onStartEditMode: () => void;
    translationFn: TranslationFn;
};
