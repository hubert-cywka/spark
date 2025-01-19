import { KeyboardEvent, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import styles from "./styles/DailyEntryInput.module.scss";

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

// TODO: Clear this mess
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

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSaveContent(content);
            onNavigateDown();
            return;
        }

        if (e.key === "Backspace" && content === "") {
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

        if (e.key === "ArrowLeft" && e.currentTarget.selectionStart === 0) {
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
        }
    };

    useEffect(() => {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

    return (
        <TextareaAutosize
            data-entry-column={column}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={styles.input}
            placeholder={placeholder}
            value={content}
        />
    );
};
