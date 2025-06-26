import { ISODateString } from "@/types/Date";

export type EntryDetailFilters = {
    from: ISODateString;
    to: ISODateString;
    goals?: string[];
    featured?: boolean;
    completed?: boolean;
    content?: string;
};
