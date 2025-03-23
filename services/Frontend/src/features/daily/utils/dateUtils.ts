import { ISODateString } from "@/types/ISODateString";

export const formatToISODateString = (date: Date): ISODateString => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
};
