import { KeyboardEvent, ReactNode, useEffect, useState } from "react";

import {
    PassiveTextInputChildrenProps,
    PassiveTextInputEditModeActionsRenderProps,
    PassiveTextInputPassiveModeActionsRenderProps,
} from "./types/PassiveTextInput";

import styles from "./styles/PassiveTextInput.module.scss";

import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useOutsideClick } from "@/hooks/useOutsideClick";

const SEGMENT_SELECTOR = '[role="spinbutton"]';

export type PassiveTextInputProps<T extends object> = {
    value: T;
    onChange: (value: T) => void;
    children: (props: PassiveTextInputChildrenProps<T>) => ReactNode;
    onRenderEditModeActions: (props: PassiveTextInputEditModeActionsRenderProps) => ReactNode;
    onRenderPassiveModeActions: (props: PassiveTextInputPassiveModeActionsRenderProps) => ReactNode;
};

export function PassiveTextInput<T extends object>({
    value,
    onChange,
    children,
    onRenderEditModeActions,
    onRenderPassiveModeActions,
}: PassiveTextInputProps<T>) {
    const [internalValue, setInternalValue] = useState<T | null>(value);
    const hasValueChanged = !!internalValue && value?.toString() !== internalValue.toString();

    const restoreInitialValue = () => {
        setInternalValue(value);
    };

    const [isInEditMode, setIsInEditMode] = useState(false);
    const startEditMode = () => setIsInEditMode(true);

    const endEditMode = () => {
        setIsInEditMode(false);
        blur();
    };

    const cancelEditMode = () => {
        endEditMode();
        restoreInitialValue();
    };

    const blur = () => {
        const focusableElements = ref.current?.querySelectorAll(SEGMENT_SELECTOR);
        focusableElements?.forEach((element) => (element as HTMLElement).blur());
    };

    const confirmValueUpdate = async () => {
        if (!internalValue || !isInEditMode) {
            return;
        }

        onChange(internalValue);
        endEditMode();
    };

    const updateValueOnEnter = async (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && isInEditMode) {
            e.preventDefault();
            await confirmValueUpdate();
        }
    };

    const ref = useOutsideClick<HTMLDivElement>(cancelEditMode);
    useKeyboardShortcut({ keys: ["Escape"], callback: cancelEditMode });

    useEffect(
        function autoFocusOnEditModeChange() {
            if (isInEditMode && ref.current) {
                const focusableElement = ref.current.querySelector(SEGMENT_SELECTOR) as HTMLElement | null;
                focusableElement?.focus();
            }
        },
        [isInEditMode, ref]
    );

    return (
        <div className={styles.header} ref={ref}>
            {children({
                onChange: setInternalValue,
                onKeyDown: updateValueOnEnter,
                isDisabled: !isInEditMode,
                value: internalValue,
            })}
            <div className={styles.buttons}>
                {isInEditMode
                    ? onRenderEditModeActions({
                          onCancelEditMode: cancelEditMode,
                          onSaveChanges: confirmValueUpdate,
                          hasValueChanged,
                      })
                    : onRenderPassiveModeActions({
                          onStartEditMode: startEditMode,
                      })}
            </div>
        </div>
    );
}
