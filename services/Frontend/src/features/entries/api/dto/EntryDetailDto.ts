import { ISODateString } from "@/types/ISODateString";

export type EntryDetailDto = {
    id: string;
    daily: ISODateString;
    content: string;
    isCompleted: boolean;
    isFeatured: boolean;
    goals: string[];
};
