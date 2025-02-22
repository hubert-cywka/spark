import { KeyboardEvent } from "react";

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
};

export type PassiveTextInputPassiveModeActionsRenderProps = {
    onStartEditMode: () => void;
};
