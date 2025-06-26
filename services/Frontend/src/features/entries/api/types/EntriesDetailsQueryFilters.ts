import { ISODateString } from "@/types/ISODateString";

export type EntriesDetailsQueryFilters = {
    goals?: string[];
    content?: string;
    from: ISODateString;
    to: ISODateString;
    featured?: boolean;
    completed?: boolean;
};
