import { ISODateString } from "@/types/Date";

export type GoalFilters = {
    entries?: string[];
    name?: string;
    excludeEntries?: string[];
    withProgress?: boolean;
    from?: ISODateString;
    to?: ISODateString;
};
