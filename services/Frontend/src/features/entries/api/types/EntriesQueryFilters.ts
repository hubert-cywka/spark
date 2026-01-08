import { ISODateString } from "@/types/ISODateString";

export type EntriesQueryFilters = {
    goals?: string[];
    from?: ISODateString;
    to?: ISODateString;
    featured?: boolean;
    completed?: boolean;
    content?: string;
    includeGoals?: boolean;
    includeDaily?: boolean;
};
