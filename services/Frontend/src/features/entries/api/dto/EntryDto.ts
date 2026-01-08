import { ISODateString } from "@/types/ISODateString";

export type EntryDto = {
    id: string;
    date: ISODateString;
    authorId: string;
    content: string;
    isCompleted: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;

    goals?: string[];
};
