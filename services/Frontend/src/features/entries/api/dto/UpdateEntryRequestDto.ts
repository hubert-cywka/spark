import { ISODateString } from "@/types/ISODateString";

export type UpdateEntryRequestDto = {
    date?: ISODateString;
    content?: string;
    isFeatured?: boolean;
    isCompleted?: boolean;
};
