import { FocusEventHandler, KeyboardEvent, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import styles from "./styles/DailyEntry.module.scss";

import { Entry } from "@/features/entries/types/Entry";

const CONTENT_UPDATE_DEBOUNCE = 2000;

type DailyEntryProps = {
    entry: Partial<Entry> & Pick<Entry, "dailyId">;
    onNavigateUp?: () => void;
    onNavigateDown?: () => void;
    onSaveContent: (content: string) => void;
    onDelete: (dailyId: string, entryId?: string) => void;
};

export const DailyEntry = ({ entry, onSaveContent, onDelete, onNavigateUp, onNavigateDown }: DailyEntryProps) => {
    const [content, setContent] = useState(entry?.content ?? "");
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSaveContent = () => {
        if (!content || entry?.content === content) {
            return;
        }
        onSaveContent(content);
    };

    const handleDebouncedSave = (newContent: string) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            onSaveContent(newContent);
        }, CONTENT_UPDATE_DEBOUNCE);
    };

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        handleDebouncedSave(newContent);
    };

    const handleNavigateDown = () => {
        if (!content) {
            return;
        }
        onNavigateDown?.();
    };

    const handleDelete = () => {
        onDelete(entry.dailyId, entry.id);
    };

    const handleNavigateUp = () => {
        if (!content) {
            handleDelete();
        }
        onNavigateUp?.();
    };

    const setFocusAtLastCharacter: FocusEventHandler<HTMLTextAreaElement> = (e) => {
        e.target.setSelectionRange(content.length, content.length);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSaveContent();
            handleNavigateDown();
            return;
        }

        if (e.key === "Backspace" && content === "") {
            e.preventDefault();
            handleDelete();
            handleNavigateUp();
            return;
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            handleNavigateUp();
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            handleNavigateDown();
        }
    };

    const handleBlur = () => {
        if (!content) {
            handleDelete();
        } else {
            handleSaveContent();
        }
    };

    useEffect(function clearContentUpdateDebounce() {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

    return (
        <li className={styles.container}>
            <TextareaAutosize
                id={entry.id ? `entry-${entry.id}` : `entry-placeholder-${entry.dailyId}`}
                onChange={(e) => handleContentChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className={styles.input}
                placeholder="Share your plans or accomplishments!"
                value={content}
                onFocus={setFocusAtLastCharacter}
            />
        </li>
    );
};

type DailyEntryPlaceholderProps = {
    dailyId: string;
    onNavigateUp?: () => void;
    onNavigateDown?: () => void;
    onSaveContent: (content: string) => void;
    onDelete: () => void;
};

export const DailyEntryPlaceholder = ({ dailyId, onSaveContent, onDelete, onNavigateUp, onNavigateDown }: DailyEntryPlaceholderProps) => {
    const [content, setContent] = useState("");
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSaveContent = () => {
        if (!content) {
            return;
        }
        onSaveContent(content);
    };

    const handleDebouncedSave = (newContent: string) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            onSaveContent(newContent);
        }, CONTENT_UPDATE_DEBOUNCE);
    };

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        handleDebouncedSave(newContent);
    };

    const handleNavigateDown = () => {
        if (!content) {
            return;
        }
        onNavigateDown?.();
    };

    const handleNavigateUp = () => {
        if (!content) {
            onDelete();
        }
        onNavigateUp?.();
    };

    const setFocusAtLastCharacter: FocusEventHandler<HTMLTextAreaElement> = (e) => {
        e.target.setSelectionRange(content.length, content.length);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSaveContent();
            handleNavigateDown();
            return;
        }

        if (e.key === "Backspace" && content === "") {
            e.preventDefault();
            onDelete();
            handleNavigateUp();
            return;
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            handleNavigateUp();
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            handleNavigateDown();
        }
    };

    const handleBlur = () => {
        if (!content) {
            onDelete();
        } else {
            handleSaveContent();
        }
    };

    useEffect(function clearContentUpdateDebounce() {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

    return (
        <li className={styles.container}>
            <TextareaAutosize
                id={`entry-placeholder-${dailyId}`}
                onChange={(e) => handleContentChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className={styles.input}
                placeholder="Share your plans or accomplishments!"
                value={content}
                onFocus={setFocusAtLastCharacter}
            />
        </li>
    );
};
