import { FocusEventHandler, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import classNames from "clsx";

import styles from "./styles/DailyEntryInput.module.scss";

import { DailyEntryComponentProps } from "@/features/entries/components/DailyEntry/components/shared/DailyEntryComponent";
import { FormattedEntryContent } from "@/features/entries/components/FormattedEntryContent/FormattedEntryContent.tsx";

const CONTENT_UPDATE_DEBOUNCE = 2000;

type DailyEntryInputProps = {
    initialContent: string;
    onSaveContent: (content: string) => void;
    onDelete: () => void;
    placeholder: string;
} & DailyEntryComponentProps;

export const DailyEntryInput = ({
    initialContent,
    onNavigateUp,
    onNavigateDown,
    onNavigateLeft,
    onSaveContent,
    onDelete,
    placeholder,
    column,
}: DailyEntryInputProps) => {
    const [content, setContent] = useState(initialContent);
    const [isEditing, setIsEditing] = useState(!initialContent);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const shouldAutoFocus = useRef<boolean | null>(null);

    const handleSaveContent = (newContent: string) => {
        if (!newContent.trim() || initialContent === newContent) {
            return;
        }
        onSaveContent(newContent);
    };

    const handleDebouncedSave = (newContent: string) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            handleSaveContent(newContent);
        }, CONTENT_UPDATE_DEBOUNCE);
    };

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        handleDebouncedSave(newContent);
    };

    const closeEditMode = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (isEditing && e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSaveContent(content);
            closeEditMode();
            onNavigateDown?.();
            return;
        }

        if (isEditing && e.key === "Backspace" && content === "") {
            e.preventDefault();
            onDelete();
            onNavigateUp?.();
            return;
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            onNavigateUp?.();
            return;
        }

        if (isEditing && e.key === "ArrowLeft" && e.currentTarget.selectionStart === 0) {
            e.preventDefault();
            onNavigateLeft?.();
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            onNavigateDown?.();
        }
    };

    const handleBlur = () => {
        shouldAutoFocus.current = false;

        if (!content) {
            onDelete();
        } else {
            handleSaveContent(content);
            closeEditMode();
        }
    };

    const handleFocus = () => {
        shouldAutoFocus.current = true;
        setIsEditing(true);
    };

    useEffect(() => {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

    if (isEditing) {
        return (
            <TextareaAutosize
                data-entry-column={column}
                onChange={(e) => handleContentChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onFocus={setSelectionOnLastCharacter}
                className={classNames(styles.content, styles.editable)}
                placeholder={placeholder}
                value={content}
                autoFocus={!!shouldAutoFocus.current}
            />
        );
    }

    return (
        <span
            tabIndex={0}
            data-entry-column={column}
            className={styles.content}
            onMouseDown={preventFocusOnLinkClick}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
        >
            <FormattedEntryContent content={content} />
        </span>
    );
};

const setSelectionOnLastCharacter: FocusEventHandler<HTMLTextAreaElement> = (e) => {
    const target = e.target;
    target.setSelectionRange(target.value.length, target.value.length);
};

const preventFocusOnLinkClick = (e: MouseEvent<HTMLSpanElement>) => {
    const target = e.target as HTMLElement;

    if (target.tagName === "A") {
        e.preventDefault();
    }
};
