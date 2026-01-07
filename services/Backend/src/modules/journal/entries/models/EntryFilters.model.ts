import { ISODateString } from "@/types/Date";

export type EntryFilters = {
    withDaily?: boolean;
    from?: ISODateString;
    to?: ISODateString;

    withGoals?: boolean;
    goals?: string[];

    featured?: boolean;
    completed?: boolean;

    content?: string;

    updatedAfter?: Date;
    updatedBefore?: Date;
};
