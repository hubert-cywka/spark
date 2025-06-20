import { ISODateString } from "@/types/ISODateString";

export type EntryRow = {
    id: string;
    daily: ISODateString;
    content: string;
    isCompleted: boolean;
    isFeatured: boolean;
    createdAt: Date;
};

export type EntriesDataGridColumn = keyof EntryRow;
