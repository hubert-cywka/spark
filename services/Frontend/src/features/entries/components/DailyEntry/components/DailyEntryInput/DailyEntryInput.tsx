import { FocusEventHandler, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import classNames from "clsx";

import styles from "./styles/DailyEntryInput.module.scss";

import { Anchor } from "@/components/Anchor";
import { DailyEntryColumn } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";

const CONTENT_UPDATE_DEBOUNCE = 2000;

type DailyEntryInputProps = {
    initialContent: string;
    onNavigateUp: () => void;
    onNavigateDown: () => void;
    onNavigateLeft?: () => void;
    onSaveContent: (content: string) => void;
    onDelete: () => void;
    placeholder: string;
    column: DailyEntryColumn;
};

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
            onNavigateDown();
            return;
        }

        if (isEditing && e.key === "Backspace" && content === "") {
            e.preventDefault();
            onDelete();
            onNavigateUp();
            return;
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            onNavigateUp();
            return;
        }

        if (isEditing && e.key === "ArrowLeft" && e.currentTarget.selectionStart === 0) {
            e.preventDefault();
            onNavigateLeft?.();
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            onNavigateDown();
        }
    };

    const handleBlur = () => {
        if (!content) {
            onDelete();
        } else {
            handleSaveContent(content);
            closeEditMode();
        }
    };

    const handleFocus = () => {
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
                autoFocus // TODO: Improve focus management, auto focus is not good solution
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
            {onRenderContent(content)}
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

const onRenderContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
        if (urlRegex.test(part)) {
            const displayText = part.replace(/https?:\/\//, "");

            return (
                <Anchor href={part} target="_blank" rel="noopener noreferrer" className={styles.link} key={index}>
                    {displayText}
                </Anchor>
            );
        }
        return <span key={index}>{part}</span>;
    });
};
