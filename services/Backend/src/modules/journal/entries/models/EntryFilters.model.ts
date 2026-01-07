import { ISODateString } from "@/types/Date";

export type EntryFilters = {
    from?: ISODateString;
    to?: ISODateString;
    goals?: string[];
    featured?: boolean;
    completed?: boolean;
    content?: string;
    updatedAfter?: Date;
    updatedBefore?: Date;
};
