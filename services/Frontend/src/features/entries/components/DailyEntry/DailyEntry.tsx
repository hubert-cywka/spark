import { FocusEventHandler, KeyboardEvent, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import styles from "./styles/DailyEntry.module.scss";

import { Entry } from "@/features/entries/types/Entry";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

const CONTENT_UPDATE_DEBOUNCE = 2000;

type EntryProps = {
    id: string;
    initialContent: string;
    onNavigateUp: () => void;
    onNavigateDown: () => void;
    onSaveContent: (content: string) => void;
    onDelete: () => void;
    placeholder: string;
};

// TODO: Clear this mess
const EntryComponent = ({ id, initialContent, onNavigateUp, onNavigateDown, onSaveContent, onDelete, placeholder }: EntryProps) => {
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

    const setFocusAtLastCharacter: FocusEventHandler<HTMLTextAreaElement> = (e) => {
        e.target.setSelectionRange(content.length, content.length);
    };

    useEffect(() => {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

    return (
        <li className={styles.container}>
            <TextareaAutosize
                id={id}
                onChange={(e) => handleContentChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className={styles.input}
                placeholder={placeholder}
                value={content}
                onFocus={setFocusAtLastCharacter}
            />
        </li>
    );
};

type DailyEntryProps = {
    id: string;
    entry: Entry;
    onNavigateUp: () => void;
    onNavigateDown: () => void;
    onSaveContent: (content: string) => void;
    onDelete: (dailyId: string, entryId: string) => void;
};

export const DailyEntry = ({ entry, onSaveContent, onDelete, onNavigateUp, onNavigateDown, id }: DailyEntryProps) => {
    const t = useTranslate();

    return (
        <EntryComponent
            id={id}
            initialContent={entry.content}
            onNavigateUp={onNavigateUp}
            onNavigateDown={onNavigateDown}
            onSaveContent={onSaveContent}
            onDelete={() => onDelete(entry.dailyId, entry.id)}
            placeholder={t("entries.placeholder")}
        />
    );
};

type DailyEntryPlaceholderProps = {
    id: string;
    onNavigateUp: () => void;
    onNavigateDown: () => void;
    onSaveContent: (content: string) => void;
    onDelete: () => void;
};

export const DailyEntryPlaceholder = ({ onSaveContent, onDelete, onNavigateUp, onNavigateDown, id }: DailyEntryPlaceholderProps) => {
    const t = useTranslate();

    return (
        <EntryComponent
            id={id}
            initialContent=""
            onNavigateUp={onNavigateUp}
            onNavigateDown={onNavigateDown}
            onSaveContent={onSaveContent}
            onDelete={onDelete}
            placeholder={t("entries.placeholder")}
        />
    );
};
