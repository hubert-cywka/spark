import { ISODateString } from "@/types/Date";

export type EntryFilters = {
    from?: ISODateString;
    to?: ISODateString;
    goals?: string[];
    content?: string;
    featured?: boolean;
    completed?: boolean;
};
