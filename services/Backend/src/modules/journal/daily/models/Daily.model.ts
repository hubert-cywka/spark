import { type ISODateString } from "@/types/Date";

export type Daily = {
    id: string;
    authorId: string;
    date: ISODateString;
    createdAt: Date;
    updatedAt: Date;
};
