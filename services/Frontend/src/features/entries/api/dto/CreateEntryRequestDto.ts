import { ISODateString } from "@/types/ISODateString";

export type CreateEntryRequestDto = {
    date: ISODateString;
    content: string;
    isFeatured?: boolean;
    isCompleted?: boolean;
};
