export type ISODateString = `${string}-${string}-${string}` | `${number}-${number}-${number}`;

export type ISODateStringRange = {
    from: ISODateString;
    to: ISODateString;
};

export type DateStringRange = {
    from: string;
    to: string;
};

export type DateRange = {
    from: Date;
    to: Date;
};
